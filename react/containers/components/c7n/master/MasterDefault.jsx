import React, { Component, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import {inject, observer, Provider} from 'mobx-react';
import {Icon, Popover, Spin, Message} from 'choerodon-ui';
import { observer as liteObserver } from 'mobx-react-lite';
import queryString from 'query-string';
import getSearchString from '@/containers/components/c7n/util/gotoSome';
import { message, Button, Modal, DataSet, Table, Tooltip } from 'choerodon-ui/pro';
import get from 'lodash/get';
import MasterServices from "@/containers/components/c7n/master/services";
import axios from '../tools/axios';
import MasterHeader from '../ui/header';
import AnnouncementBanner from '../ui/header/AnnouncementBanner';
import RouteIndex from './RouteIndex';
import themeColorClient from './themeColorClient';
import './style';
import Skeleton from './skeleton';
import CommonMenu, { defaultBlackList } from '../ui/menu';
import popoverHead from "@/containers/images/popoverHead.png";
import MasterApis from "@/containers/components/c7n/master/apis";

const spinStyle = {
  textAlign: 'center',
  paddingTop: 300,
};

// 这里是没有菜单的界面合集
// 记录下route和code 为了方便查询该界面的文档地址
const routeWithNoMenu = [{
  route: 'workbench',
  code: 'workbench',
}, {
  route: 'projects',
  code: 'projects',
}, {
  route: 'knowledge/organization',
  code: 'knowledge',
}, {
  route: 'app-market',
  code: 'app-market',
}]

const { Column } = Table;

let maxLength = 0;

// 这里是因为在路由改变时 函数中拿到的当前activeMenu可能还未变化
// 给定一个参数 如果重复调用方法三次还没改变则跳过逻辑
let activeMenuTimes = 0;

// 这里是helpDoc的
let activeMenuTimes_doc = 0;

function parseQueryToMenuType(search) {
  const menuType = {};
  if (search) {
    const {
      type, name, id, organizationId, category,
    } = queryString.parse(search);
    if (type) {
      menuType.type = type;
    }
    if (category) {
      menuType.category = category;
    }
    if (name) {
      menuType.name = name;
    }
    if (organizationId) {
      menuType.organizationId = organizationId;
      menuType.orgId = organizationId;
    }
    if (id) {
      menuType.id = id;
      if (type === 'project') {
        menuType.projectId = id;
      } else if (type === 'organization') {
        menuType.organizationId = id;
      }
    }
    if (type === 'project' && organizationId) {
      menuType.organizationId = organizationId;
    }
  }

  return menuType;
}

const HAS_BASE_PRO = C7NHasModule('@choerodon/base-pro');



let ExceedCountUserDataSet

const OwnerTitle = liteObserver((props) => {
  const { ds } = props;

  const [num, setNum] = useState(0);

  useEffect(() => {
    setNum(ds.selected.length);
  }, [ds.selected])

  return (
    <p className="c7ncd-master-header">
      <span>选择组织用户</span>
      <span>
        (已选择<span>{num || 0}</span>人)
      </span>
    </p>
  )
})

const OwnerModal = liteObserver((props) => {
  const {
    num,
    ds,
  } = props;

  return (
    <div className="c7ncd-master-owner">
      <p>
        <Icon type="info" />
        {`因您购买的高级版套餐最多允许组织内${num}人同时使用，请在组织下已有用户中选择${num}人。未选中的用户后续将不能进入该组织。`}
      </p>
      <Table
        dataSet={ds}
      >
        <Column name="realName" />
        <Column name="email" />
        <Column name="roleNames" />
      </Table>
    </div>
  )
})

@withRouter
@inject('AppState', 'MenuStore', 'HeaderStore')
@observer
class Masters extends Component {
  componentWillMount() {
    this.initMenuType(this.props);
    const themeColor = localStorage.getItem('C7N-THEME-COLOR');
    this.updateTheme(themeColor);
    this.state = {
      guideOpen: false,
      guideContent: undefined,
    }
    this.handleSetGuideContent(this.props);
    this.handleGetHelpDocUrl(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.judgeIfGetUserCountCheck(nextProps, this.props);
    this.initMenuType(nextProps);
    this.getGuideContentByLocationChange(nextProps, this.props);
  }

  handleSetGuideContent = (newProps) => {
    const activeMenu = newProps.MenuStore.activeMenu;
    // 如果activeMenu是当前路由
    if (activeMenu && window.location.hash.includes(activeMenu.route)) {
      activeMenuTimes = 0;
      const { projectId, organizationId } = newProps.AppState.menuType;
      const menuId = activeMenu.id;
      const search = newProps.location.search
      const searchParams = new URLSearchParams(search);
      let data = {};
      switch (searchParams.get('type')) {
        case 'project': {
          data = {
            menuId: activeMenu.id,
            orgId: organizationId,
            proId: projectId,
          }
          break;
        }
        case 'organization': {
          data = {
            menuId: activeMenu.id,
            orgId: organizationId,
          }
          break;
        }
        case null: {
          // 平台层
          data = {
            menuId: activeMenu.id,
            orgId: 0,
          }
          break;
        }
      }
      MasterServices.axiosGetGuide(data).then((res) => {
        this.setState({
          guideContent: res,
        });
      })
    } else if (activeMenuTimes < 3) {
      activeMenuTimes += 1;
      setTimeout(() => {
        this.handleSetGuideContent(newProps)
      }, 500)
    } else {
      activeMenuTimes = 0
      this.setState({
        guideContent: undefined,
      })
    }
  }

  getGuideContentByLocationChange = (newProps, oldProps) => {
    const { pathname: newPathname, search: newSearch } = newProps.location;
    const { pathname: oldPathname, search: oldSearch } = oldProps.location;
    if (newPathname !== oldPathname || newSearch !== oldSearch) {
      if (this.state.guideOpen) {
        this.setState({
          guideOpen: false,
        })
      }
      this.handleSetGuideContent(newProps);
      this.handleGetHelpDocUrl(newProps);
    }
  }

  setDocUrl = async (params) => {
    if (JSON.stringify(params) !== '{}') {
      const result = await MasterServices.axiosGetHelpDoc(params);
      console.log(result);
    }
  }

  /**
   * 路径改变时 查询当前路由对应的文档地址
   */
  handleGetHelpDocUrl = (newProps) => {
    const params = {};
    const pathname = newProps?.history?.location?.pathname;
    const item = pathname && routeWithNoMenu.find(i => pathname.includes(i.route));
    // 如果当前路由匹配到了没有菜单的界面
    if (item) {
      params.menuCode = item.code;
      this.setDocUrl(params);
    } else {
      const activeMenu = newProps.MenuStore.activeMenu;
      if (activeMenu && window.location.hash.includes(activeMenu.route)) {
        activeMenuTimes_doc = 0;
        params.menuId = activeMenu.id;
        if (newProps.history.location.search.includes('activeKey')) {
          const params = new URLSearchParams(newProps.history.location.search);
          params.tabCode = params.get('activeKey');
        }
        this.setDocUrl(params);
      } else if (activeMenuTimes_doc < 3) {
        activeMenuTimes_doc += 1;
        setTimeout(() => {
          this.handleGetHelpDocUrl(newProps);
        }, 500)
      } else {
        activeMenuTimes = 0
      }
    }
    console.log(params);
  }

  judgeIfGetUserCountCheck = (newProps, oldProps) => {
    const newParams = new URLSearchParams(newProps.location.search);
    const oldParams = new URLSearchParams(oldProps.location.search);
    if (newParams.get('organizationId') !== oldParams.get('organizationId')) {
      this.getUserCountCheck(newParams.get('organizationId'));
    }
  }

  componentDidMount() {
    this.initFavicon();

    this.getUserCountCheck();

    ExceedCountUserDataSet = new DataSet({
      autoQuery: false,
      transport: {
        read: ({ data }) => {
          const { orgId } = data;
          return ({
            url: MasterApis.getPageMemberUrl(orgId),
            method: 'get',
            transformResponse: (res) => {
              let newRes = res;
              try {
                newRes = JSON.parse(res);
                newRes.content = newRes.content.map((i) => {
                  i.roleNames = i.roleNames.join(',');
                  return i;
                });
                return newRes;
              } catch (e) {
                return newRes
              }
            }
          })
        },
      },
      fields: [{
        name: 'realName',
        type: 'string',
        label: '用户名',
      }, {
        name: 'email',
        type: 'string',
        label: '邮箱',
      }, {
        name: 'roleNames',
        type: 'string',
        label: '组织角色',
      }],
      events: {
        select: ({ dataSet, record }) => {
          this.setRecordByMaxLength(dataSet, record, maxLength, true);
        },
        unSelect: ({ dataSet, record }) => {
          this.setRecordByMaxLength(dataSet, record, maxLength, false);
        },
        load: ({ dataSet }) => {
          dataSet.records.forEach(i => {
            if (i.get('owner')) {
              i.selectable = false;
              i.isSelected = true;
            }
          })
        }
      }
    })
    // if (pathname.includes('access_token') && pathname.includes('token_type') && localStorage.getItem(`historyPath-${getUserId}`)) {
    //   window.location = `/#${localStorage.getItem(`historyPath-${getUserId}`)}`;
    // }
  }

  setRecordByMaxLength = (ds, re, length, selectIf) => {
    const selectedLength = ds.selected.length;
    const selectedIds = ds.selected.map(i => i.id);
    if (selectIf) {
      if (selectedLength >= length) {
        ds.records.forEach(i => {
          if (!selectedIds.includes(i.id)) {
            i.selectable = false;
          }
        })
      }
    } else {
      ds.records.forEach(i => {
        if (!i.get('owner')) {
          i.selectable = true;
        }
      })
    }
  }

  getUserCountCheck = async (orgId) => {
    const organizationId = orgId || this.props.AppState.currentMenuType.organizationId;
    if (organizationId) {
      let res = await MasterServices.axiosGetCheckUserCount(organizationId);
      if (res && !res.data && res.data !== '') {
        // 用户超过套餐任务
        maxLength = res;
        const user = await MasterServices.axiosGetCheckOwner(organizationId);
        if (user && user.data === '') {
          // 当前用户就是注册者
          ExceedCountUserDataSet.setQueryParameter('orgId', organizationId);
          await ExceedCountUserDataSet.query();
          Modal.open({
            maskClosable: false,
            style: {
              width: 820,
            },
            okCancel: false,
            key: Modal.key(),
            title: <OwnerTitle ds={ExceedCountUserDataSet} />,
            children: <OwnerModal num={res} ds={ExceedCountUserDataSet}  />,
            onOk: async () => {
              const selectedLength = ExceedCountUserDataSet.selected.length;
              if (selectedLength !== maxLength) {
                message.error(`请选择${maxLength}个用户`);
                return false;
              } else {
                try {
                  await MasterServices.axiosDeleteCleanMember(organizationId, ExceedCountUserDataSet.selected.map(i => i.get('id')));
                  this.getUserCountCheck();
                } catch (e) {
                  return false;
                }
              }
            }
          })
        } else {
          // 此user是注册者
          const { email, realName } = user;
          Modal.open({
            maskClosable: false,
            key: Modal.key(),
            title: 'SaaS组织升级中',
            children: `您所在组织的组织所有者${realName}(${email})升级组织后尚未确认组织用户，请联系组织所有者确认。`,
            footer: null,
          })
        }
      }
      return true;
    } else {
      setTimeout(() => {
        this.getUserCountCheck();
      }, 500);
    }
  }

  updateTheme = (newPrimaryColor) => {
    if (newPrimaryColor === 'undefined' || newPrimaryColor === 'null' || !newPrimaryColor) {
      return;
    }
    const colorArr = newPrimaryColor.split(',');
    let c1; let c2;
    if (colorArr.length === 2) {
      [c1, c2] = colorArr;
    } else if (colorArr.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      c1 = colorArr[0];
      // eslint-disable-next-line prefer-destructuring
      c2 = colorArr[0];
    } else if (!colorArr.length) {
      return;
    }
    themeColorClient.changeColor(c1, c2)
      .finally(() => {
        // eslint-disable-next-line no-console
        console.log(`[Choerodon] Current Theme Color: ${newPrimaryColor}`);
      });
  }

  isInOutward = (pathname) => {
    // eslint-disable-next-line no-underscore-dangle
    const injectOutward = window._env_.outward;
    if (injectOutward) {
      const arr = injectOutward.split(',').concat(['/unauthorized']);
      return arr.some((v) => pathname.startsWith(v));
    }
    return false;
  }

  initFavicon() {
    const { AppState } = this.props;
    AppState.loadSiteInfo().then((data) => {
      const link = document.createElement('link');
      const linkDom = document.getElementsByTagName('link');
      if (linkDom) {
        for (let i = 0; i < linkDom.length; i += 1) {
          if (linkDom[i].getAttribute('rel') === 'shortcut icon') document.head.removeChild(linkDom[i]);
        }
      }
      link.id = 'dynamic-favicon';
      link.rel = 'shortcut icon';
      link.href = get(data, 'favicon') || 'favicon.ico';
      document.head.appendChild(link);
      if (data) {
        data.defaultTitle = document.getElementsByTagName('title')[0].innerText;
        document.getElementsByTagName('title')[0].innerText = get(data, 'systemTitle');
      }
      AppState.setSiteInfo(data);
      this.updateTheme(data?.themeColor);
      localStorage.setItem('C7N-THEME-COLOR', data?.themeColor);
    });
  }

  initMenuType(props) {
    const {
      location, MenuStore, HeaderStore, history, AppState,
    } = props;
    const { pathname, search } = location;
    let isUser = false;
    let needLoad = false;
    let menuType = parseQueryToMenuType(search);
    if (pathname === '/') {
      const recent = HeaderStore.getRecentItem;
      if (recent.length && !sessionStorage.home_first_redirect) {
        const {
          id, name, type, organizationId,
        } = recent[0];
        menuType = {
          id, name, type, organizationId,
        };
        needLoad = true;
      } else {
        menuType = {};
      }
      sessionStorage.home_first_redirect = 'yes';
    } else if (menuType.type === 'site') {
      isUser = true;
    } else if (!menuType.type) {
      menuType.type = 'site';
    } else if (menuType.type === 'project' && (!menuType.category || menuType.category === 'undefined')) {
      // const project = filter(HeaderStore.getProData, ({ id, organizationId }) => String(id) === menuType.id && String(organizationId) === menuType.organizationId)[0];
      // if (project) {
      //   menuType.category = project.category;
      // }
    }
    async function checkUrl() {
      async function goSafty(data) {
        if (!HeaderStore.getOrgData) {
          setTimeout(() => {
            goSafty();
          }, 500);
        } else {
          message.info(data ? '该项目已停用' : '地址过期');
          // 说明是停用项目 需要删除最近使用的数据
          if (data) {
            const recents = JSON.parse(localStorage.getItem('recentItem'));
            const newRecents = recents.filter((r) => r.code !== data.code);
            localStorage.setItem('recentItem', JSON.stringify(newRecents));
            HeaderStore.recentItem = newRecents;
          }
          AppState.setCurrentProject(null);
          const queryObj = queryString.parse(history.location.search);
          const search = await getSearchString('organization', 'id', queryObj.organizationId);
          MenuStore.setActiveMenu(null);
          history.push(`/projects${search}`);
        }
      }
      if (menuType.projectId) {
        const currentProject = AppState.getCurrentProject;
        let res;
        if (!currentProject || String(menuType.projectId) !== String(currentProject?.id)) {
          try {
            res = await axios.get(`/iam/choerodon/v1/projects/${menuType.projectId}/basic_info`);
            if (!res.enabled) {
              goSafty(res);
            }
            if (String(res.id) === String(new URLSearchParams(location.search).get('id'))) {
              AppState.setCurrentProject(res);
            } else {
              return true;
            }
          } catch (e) {
            goSafty();
            return true;
          }
        } else {
          res = currentProject;
        }
        const checkArray = ['category', 'name', 'organizationId'];
        if (checkArray.some((c) => {
          if (menuType[c] && menuType[c] !== 'undefined' && String(menuType[c]) !== String(res[c])) {
            return true;
          }
        })) {
          goSafty();
          return true;
        }
        AppState.changeMenuType({ ...menuType, categories: res.categories?.slice() });
        return true;
      }
    }

    AppState.setTypeUser(isUser);
    AppState.changeMenuType(menuType, checkUrl);
    // if (needLoad) {
    //   MenuStore.loadMenuData().then((menus) => {
    //     if (menus.length) {
    //       const { route, domain } = findFirstLeafMenu(menus[0]);
    //       const { type, name, id, organizationId } = AppState.currentMenuType;
    //       let path = `${route}?type=${type}&id=${id}&name=${name}`;
    //       if (organizationId) {
    //         path += `&organizationId=${organizationId}`;
    //       }
    //       historyReplaceMenu(history, path, domain);
    //     }
    //   });
    // }
  }

  guidePopover() {
    return (
      <div className="c7ncd-guide-popover">
        <div className="c7ncd-guide-popover-head">
          <span style={{ width: '43%', display: 'inline-block' }}>
            {this.state.guideContent && this.state.guideContent.title ? this.state.guideContent.title : '平台指引'}
          </span>
          <img src={popoverHead} alt=""/>
        </div>
        <div className="c7ncd-guide-popover-content">
          {
            this.state.guideContent
            && this.state.guideContent.userGuideStepVOList
            && this.state.guideContent.userGuideStepVOList.map(item => (
              <div className="c7ncd-guide-popover-content-item">
                <div className="c7ncd-guide-popover-content-item-left">
                  <p className="c7ncd-guide-popover-content-item-left-stepName">{item.stepName}</p>
                  <p className="c7ncd-guide-popover-content-item-left-description">
                    {item.description}
                    <span
                      onClick={() => {
                        window.open(item.docUrl);
                      }}
                    >指引文档</span>
                  </p>
                </div>
                <Tooltip title={!item.permitted && '暂无目标页面权限'}>
                  <Button
                    disabled={!item.permitted}
                    onClick={() => {
                      if (item.pageUrl) {
                        window.open(`${window.location.origin}/#${item.pageUrl}`);
                      }
                    }}
                  >
                    去设置
                  </Button>
                </Tooltip>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  handleClickGuide() {
    this.setState({
      guideOpen: !this.state.guideOpen
    });
  }

  /**
   * 指引dom
   */
  renderGuide() {
    if (HAS_BASE_PRO && this.state.guideContent) {
      return (
        <Popover
          visible={this.state.guideOpen}
          content={this.guidePopover()}
          trigger="click"
          placement="topRight"
          overlayClassName="c7ncd-guide-origin"
        >
          <div
            className="c7ncd-guide"
            onClick={this.handleClickGuide.bind(this)}
          >
            <Icon
              type={this.state.guideOpen ? 'close' : "touch_app-o"}
            />
          </div>
        </Popover>
      )
    }
    return '';
  }

  render() {
    const {
      AutoRouter, AppState, location, MenuStore,
    } = this.props;
    const search = new URLSearchParams(location.search);
    const fullPage = search.get('fullPage');
    if (this.isInOutward(this.props.location.pathname)) {
      return (
        <div className="page-wrapper">
          <RouteIndex AutoRouter={AutoRouter} />
        </div>
      );
    }
    return (
      AppState.isAuth && AppState.currentMenuType ? (
        <div className="page-wrapper">
          <div className="page-header" style={fullPage ? { display: 'none' } : {}}>
            <AnnouncementBanner />
            <MasterHeader />
          </div>
          <div className="page-body">
            <div className="content-wrapper">
              <div id="menu" style={fullPage ? { display: 'none' } : {}}>
                <CommonMenu />
              </div>
              {this.renderGuide()}
              <div id="autoRouter" className="content">
                {
                  AppState.getCanShowRoute || defaultBlackList.some((v) => this.props.location.pathname.startsWith(v)) ? (
                    <RouteIndex AutoRouter={AutoRouter} />
                  ) : (
                    <div>
                      <Skeleton />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={spinStyle}>
          <Spin />
        </div>
      )
    );
  }
}

export default Masters;
