import React, {
  Component, useEffect, useState, createRef,
} from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';
import {
  Icon, Popover, Spin, Message,
} from 'choerodon-ui';
import { observer as liteObserver } from 'mobx-react-lite';
import queryString from 'query-string';
import getSearchString from '@/containers/components/c7n/util/gotoSome';
import {
  message, Button, Modal, DataSet, Table, Tooltip,
} from 'choerodon-ui/pro';
import get from 'lodash/get';
import { mount, get as cherodonGet } from '@choerodon/inject';
import MasterServices from '@/containers/components/c7n/master/services';
import axios from '../tools/axios';
import MasterHeader from '../ui/header';
import AnnouncementBanner from '../ui/header/AnnouncementBanner';
import RouteIndex from './RouteIndex';
import themeColorClient from './themeColorClient';
import './style';
import Skeleton from './skeleton';
import CommonMenu, { defaultBlackList } from '../ui/menu';
import popoverHead from '@/containers/images/popoverHead.png';
import MasterApis from '@/containers/components/c7n/master/apis';

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
  code: 'project-list',
}, {
  route: 'knowledge/organization',
  code: 'knowledge',
}, {
  route: 'app-market',
  code: 'app-market',
}];

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

@withRouter
@inject('AppState', 'MenuStore', 'HeaderStore')
@observer
class Masters extends Component {
  constructor(props) {
    super(props);
    this.cRef = createRef();
    this.userRef = createRef();
  }

  componentWillMount() {
    this.initMenuType(this.props);
    const themeColor = localStorage.getItem('C7N-THEME-COLOR');
    this.updateTheme(themeColor);
    cherodonGet('base-pro:handleGetHelpDocUrl') && (cherodonGet('base-pro:handleGetHelpDocUrl')(this.props, routeWithNoMenu, this.setDocUrl));
  }

  // callback = (data) => {
  //   this.setState({
  //     guideContent: data,
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    this.judgeIfGetUserCountCheck(nextProps, this.props);
    this.initMenuType(nextProps);
    this.getGuideContentByLocationChange(nextProps, this.props);
  }

  // handleSetGuideContent = (newProps) => {
  //   if (HAS_BASE_PRO) {

  // }

  getGuideContentByLocationChange = (newProps, oldProps) => {
    const { pathname: newPathname, search: newSearch } = newProps.location;
    const { pathname: oldPathname, search: oldSearch } = oldProps.location;
    if (newPathname !== oldPathname || newSearch !== oldSearch) {
      if (this.cRef?.current?.guideOpen) {
        this.cRef?.current?.setguideOpen(false);
      }
      this.cRef?.current?.handleSetGuideContent(newProps);
      cherodonGet('base-pro:handleGetHelpDocUrl') && (cherodonGet('base-pro:handleGetHelpDocUrl')(this.props, routeWithNoMenu, this.setDocUrl));
    }
  }

  setDocUrl = async (params) => {
    if (JSON.stringify(params) !== '{}') {
      const result = await MasterServices.axiosGetHelpDoc(params);
      if (result) {
        this.props.AppState.setDocUrl(result);
      }
    }
  }

  judgeIfGetUserCountCheck = (newProps, oldProps) => {
    const newParams = new URLSearchParams(newProps.location.search);
    const oldParams = new URLSearchParams(oldProps.location.search);
    if (newParams.get('organizationId') !== oldParams.get('organizationId')) {
      if (this.userRef?.current?.getUserCountCheck) {
        this.userRef.current.getUserCountCheck(newParams.get('organizationId'))
      }
      // this.getUserCountCheck(newParams.get('organizationId'));
      // this.props.AppState.getProjects();
    }
  }

  componentDidMount() {
    this.initFavicon();
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
        const checkArray = ['name', 'organizationId'];
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

  // guidePopover() {
  //   return (
  //     <div className="c7ncd-guide-popover">
  //       <div className="c7ncd-guide-popover-head">
  //         <span style={{
  //           width: '43%', display: 'inline-block', position: 'relative', zIndex: 1,
  //         }}
  //         >
  //           {this.state.guideContent && this.state.guideContent.title ? this.state.guideContent.title : '平台指引'}
  //         </span>
  //         <img src={popoverHead} alt="" />
  //       </div>
  //       <div className="c7ncd-guide-popover-content">
  //         {
  //           this.state.guideContent
  //           && this.state.guideContent.userGuideStepVOList
  //           && this.state.guideContent.userGuideStepVOList.map((item) => (
  //             <div className="c7ncd-guide-popover-content-item">
  //               <div className="c7ncd-guide-popover-content-item-left">
  //                 <p className="c7ncd-guide-popover-content-item-left-stepName">{item.stepName}</p>
  //                 <p className="c7ncd-guide-popover-content-item-left-description">
  //                   {item.description}
  //                   <span
  //                     onClick={() => {
  //                       window.open(item.docUrl);
  //                     }}
  //                   >
  //                     指引文档
  //                   </span>
  //                 </p>
  //               </div>
  //               <Tooltip title={!item.permitted && '暂无目标页面权限'}>
  //                 <Button
  //                   disabled={!item.permitted}
  //                   onClick={() => {
  //                     if (item.pageUrl) {
  //                       window.open(`${window.location.origin}/#${item.pageUrl}`);
  //                     }
  //                   }}
  //                 >
  //                   去设置
  //                 </Button>
  //               </Tooltip>
  //             </div>
  //           ))
  //         }
  //       </div>
  //     </div>
  //   );
  // }

  // handleClickGuide() {
  //   this.setState({
  //     guideOpen: !this.state.guideOpen,
  //   });
  // }

  /**
   * 指引dom
   */
  // renderGuide() {
  //   if (HAS_BASE_PRO && this.state.guideContent) {
  //     return (
  //       <Popover
  //         visible={this.state.guideOpen}
  //         content={this.guidePopover()}
  //         trigger="click"
  //         placement="topRight"
  //         overlayClassName="c7ncd-guide-origin"
  //       >
  //         <div
  //           className="c7ncd-guide"
  //           onClick={this.handleClickGuide.bind(this)}
  //         >
  //           <Icon
  //             type={this.state.guideOpen ? 'close' : 'touch_app-o'}
  //           />
  //         </div>
  //       </Popover>
  //     );
  //   }
  //   return '';
  // }

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
              {mount('base-pro:Guide', {
                ...this.props,
                MasterServices,
                popoverHead,
                cRef: this.cRef,
              })}
              {
                mount('base-pro:UserCheck', {
                  ...this.props,
                  MasterServices,
                  MasterApis,
                  cRef: this.userRef,
                })
              }
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
