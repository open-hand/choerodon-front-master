import React, {
  Component, createRef,
} from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import queryString from 'query-string';
import {
  message,
  Modal,
  Spin,
} from 'choerodon-ui/pro';
import get from 'lodash/get';
import { mount, get as cherodonGet } from '@choerodon/inject';
import getSearchString from '@/utils/gotoSome';
import MasterServices from '@/containers/components/c7n/master/services';
import axios from '@/components/axios';
import PlatformAnnouncement, { axiosGetNewSticky } from '../components/PlatformAnnouncement';
import SaaSUserAnnouncement, { getSaaSUserAvilableDays } from '../components/SaaSUserAnnouncement';
import RouteIndex from '@/routes';

import popoverHead from '@/assets/images/popoverHead.png';
import MasterApis from '@/containers/components/c7n/master/apis';
import AnnouncementBannerPro from '../components/AnnouncementBannerPro';
import Header from '@/pages/home-page/components/header';
import MenusPro from '@/pages/home-page/components/menu';

import './index.less';
import './style';
import headerStore from '@/containers/stores/c7n/HeaderStore';

// 这里是没有菜单的界面合集
// 记录下route和code 为了方便查询该界面的文档地址
const routeWithNoMenu = [
  {
    route: 'workbench',
    code: 'workbench',
  },
  {
    route: 'projects',
    code: 'project-list',
  },
  {
    route: 'knowledge/organization',
    code: 'knowledge',
  },
  {
    route: 'app-market',
    code: 'app-market',
  },
];

function parseQueryToMenuType(search) {
  const menuType = {};
  if (search) {
    const {
      type, name, id, organizationId, category,
    } = queryString.parse(
      search,
    );
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
    this.info = queryString.parse(props.history.location.search);
  }

  componentWillMount() {
    const { AppState, history } = this.props;
    AppState.loadUserInfo().then((res) => {
      if (
        res.changePasswordFlag === 1
        && !sessionStorage.getItem('infoCheckFlag')
      ) {
        Modal.open({
          title: '密码到期提醒',
          key: Modal.key(),
          destroyOnClose: true,
          width: 520,
          children:
            '您的密码即将到期，为保证消息的正常接收及您的账户安全和后续的正常使用，请前往个人中心进行修改。',
          okText: '个人中心',
          onCancel: () => {
            sessionStorage.setItem('infoCheckFlag', true);
          },
          onOk: () => {
            history.push(
              `/iam/user-info?type=user&organizationId=${this.info.organizationId}`,
            );
            sessionStorage.setItem('infoCheckFlag', true);
          },
        });
      }
    });
    this.initMenuType(this.props);
    cherodonGet('base-pro:handleGetHelpDocUrl')
      && cherodonGet('base-pro:handleGetHelpDocUrl')(
        this.props,
        routeWithNoMenu,
        this.setDocUrl,
      );
  }

  componentWillReceiveProps(nextProps) {
    this.saaSUserRestDaysAnewReq(nextProps, this.props);
    this.judgeIfGetUserCountCheck(nextProps, this.props);
    this.initMenuType(nextProps);
    this.getGuideContentByLocationChange(nextProps, this.props);
  }

  saaSUserRestDaysAnewReq=(newProps, oldProps) => {
    const newParams = new URLSearchParams(newProps.location.search);
    const oldParams = new URLSearchParams(oldProps.location.search);
    if (newParams.get('organizationId') !== oldParams.get('organizationId')) {
      headerStore.deleteAnnouncement('saas_restdays_announcement');
      this.getSaaSUserRestDays(newParams.get('organizationId'));
    }
  }

  getGuideContentByLocationChange = (newProps, oldProps) => {
    const { pathname: newPathname, search: newSearch } = newProps.location;
    const { pathname: oldPathname, search: oldSearch } = oldProps.location;
    if (newPathname !== oldPathname || newSearch !== oldSearch) {
      if (this.cRef?.current?.guideOpen) {
        this.cRef?.current?.setguideOpen(false);
      }
      this.cRef?.current?.handleSetGuideContent(newProps);
      cherodonGet('base-pro:handleGetHelpDocUrl')
        && cherodonGet('base-pro:handleGetHelpDocUrl')(
          this.props,
          routeWithNoMenu,
          this.setDocUrl,
        );
    }
  };

  setDocUrl = async (params) => {
    if (JSON.stringify(params) !== '{}') {
      this.props.AppState.setDocUrl('https://open.hand-china.com/document-center/doc/product/10177/10608?doc_id=168204&doc_code=118818');
    }
  };

  judgeIfGetUserCountCheck = (newProps, oldProps) => {
    const newParams = new URLSearchParams(newProps.location.search);
    const oldParams = new URLSearchParams(oldProps.location.search);
    if (newParams.get('organizationId') !== oldParams.get('organizationId')) {
      if (this.userRef?.current?.getUserCountCheck) {
        this.userRef.current.getUserCountCheck(newParams.get('organizationId'));
      }
      this.initStarAndRecentProjects();
    }
  };

  /**
   * 更换组织后在talenntId变化后 主动变更star and recent
   */
  initStarAndRecentProjects = () => {
    // 如果userInfo的tanantId变化了 则去重查
    const { AppState } = this.props;
    AppState.loadUserInfo().then(() => {
      AppState.getProjects();
    });
  };

  // 获取系统公告
  getPlatformAnnouncement = async () => {
    try {
      const res = await axiosGetNewSticky();
      if (res && res.failed) {
        message.error(res?.message);
        return;
      }
      const { HeaderStore } = this.props;

      const identity = 'platform_announcement';
      if (window.localStorage.getItem('announcementModalInfo')) {
        const announcementId = window.localStorage.getItem('announcementModalInfo').split('+')[0];
        if (announcementId !== res?.readId) {
          window.localStorage.setItem('announcementModalInfo', `${res?.readId}+false`);
        }
      } else {
        window.localStorage.setItem('announcementModalInfo', `${res?.readId}+false`);
      }

      if (res && (!localStorage.lastClosedId || localStorage.lastClosedId !== res?.id)) {
        HeaderStore.innsertAnnouncement(identity, {
          data: res,
          onCloseCallback: () => {
            window.localStorage.setItem('lastClosedId', `${res?.id}`);
          },
          component: <PlatformAnnouncement data={res} />,
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  // 获取SaaS 新用户的免费使用天数提醒
  getSaaSUserRestDays = async (orgId) => {
    const {
      organizationId,
    } = this.props.AppState.currentMenuType || {};
    const reqOrgId = orgId || organizationId;
    if (window._env_.BUSINESS || !organizationId || window._env_.OPEN_SOURCE == 'true') {
      return;
    }
    try {
      const res = await getSaaSUserAvilableDays(reqOrgId);
      if (res && res.failed) {
        message.error(res?.message);
        return;
      }
      const { HeaderStore } = this.props;

      const identity = 'saas_restdays_announcement';
      if (res && (!localStorage.saaslastClosedId || localStorage.saaslastClosedId !== res?.link)) {
        HeaderStore.innsertAnnouncement(identity, {
          data: res,
          onCloseCallback: () => {
            window.localStorage.setItem('saaslastClosedId', `${res?.link}`);
          },
          component: <SaaSUserAnnouncement data={res} />,
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  componentDidMount() {
    this.initFavicon();

    // 获取系统公告
    this.getPlatformAnnouncement();
    // 获取适用天数in the base-pro, only applied in the hand version
    this.getSaaSUserRestDays();
  }

  /**
   * @description: 根据返回的themeColor改变全局primaryColor变量
   * @param {*}
   * @return {*}
   */
  changePrimaryColor({
    color,
  }) {
    if (color) {
      document.documentElement.style.setProperty('--primary-color', color);
      document.documentElement.style.setProperty('--primary-color-background', `${color}0D`);
    }
  }

  initFavicon() {
    const { AppState } = this.props;
    AppState.loadSiteInfo().then((data) => {
      this.changePrimaryColor({ color: data.themeColor });
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
      // if (data) {
      //   data.defaultTitle = document.getElementsByTagName('title')[0].innerText;
      //   document.getElementsByTagName('title')[0].innerText = get(
      //     data,
      //     'systemTitle',
      //   );
      // }
      AppState.setSiteInfo(data);
    });
  }

  initMenuType(props) {
    const {
      location, MenuStore, HeaderStore, history, AppState,
    } = props;
    const { pathname, search } = location;
    let isUser = false;
    let menuType = parseQueryToMenuType(search);
    if (pathname === '/') {
      const recent = HeaderStore.getRecentItem;
      if (recent.length && !sessionStorage.home_first_redirect) {
        const {
          id, name, type, organizationId,
        } = recent[0];
        menuType = {
          id,
          name,
          type,
          organizationId,
        };
      } else {
        menuType = {};
      }
      sessionStorage.home_first_redirect = 'yes';
    } else if (menuType.type === 'site') {
      isUser = true;
    } else if (!menuType.type) {
      menuType.type = 'site';
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
          const search = await getSearchString(
            'organization',
            'id',
            queryObj.organizationId,
          );
          MenuStore.setActiveMenu(null);
          history.push(`/projects${search}`);
        }
      }
      if (menuType.projectId) {
        const currentProject = AppState.getCurrentProject;
        let res;
        if (
          !currentProject
          || String(menuType.projectId) !== String(currentProject?.id)
        ) {
          try {
            res = await axios.get(
              `/iam/choerodon/v1/projects/${menuType.projectId}/basic_info`,
            );
            if (!res.enabled) {
              goSafty(res);
            }
            if (
              String(res.id)
              === String(new URLSearchParams(location.search).get('id'))
            ) {
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
        if (
          checkArray.some((c) => {
            if (
              menuType[c]
              && menuType[c] !== 'undefined'
              && String(menuType[c]) !== String(res[c])
            ) {
              return true;
            }
          })
        ) {
          goSafty();
          return true;
        }
        AppState.changeMenuType({
          ...menuType,
          categories: res.categories?.slice(),
        });
        return true;
      }
    }

    AppState.setTypeUser(isUser);
    AppState.changeMenuType(menuType, checkUrl);
  }

  render() {
    const { AppState } = this.props;
    return (
      <Spin spinning={AppState.getIsLoadMenu}>
        <div className="page-wrapper">
          <div
            className="page-header"
          >
            <AnnouncementBannerPro />
            <Header />
          </div>
          <div className="page-body">
            <div className="content-wrapper">
              <MenusPro />
              {mount('base-pro:Guide', {
                ...this.props,
                MasterServices,
                popoverHead,
                cRef: this.cRef,
              })}
              {mount('base-pro:UserCheck', {
                ...this.props,
                MasterServices,
                MasterApis,
                cRef: this.userRef,
              })}
              <div id="autoRouter" className="content">
                <RouteIndex />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

export default Masters;
