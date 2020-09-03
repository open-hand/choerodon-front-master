import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Spin } from 'choerodon-ui';
import queryString from 'query-string';
import filter from 'lodash/filter';
import getSearchString from '@/containers/components/c7n/util/gotoSome';
import { message } from 'choerodon-ui/pro';
import axios from '../tools/axios';
import CommonMenu from '../ui/menu';
import MasterHeader from '../ui/header';
import AnnouncementBanner from '../ui/header/AnnouncementBanner';
import RouteIndex from './RouteIndex';
import themeColorClient from './themeColorClient';
import './style';
import HeaderStore from "@/containers/stores/c7n/HeaderStore";

const spinStyle = {
  textAlign: 'center',
  paddingTop: 300,
};

function parseQueryToMenuType(search) {
  const menuType = {};
  if (search) {
    const { type, name, id, organizationId, category } = queryString.parse(search);
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
  componentWillMount() {
    this.initMenuType(this.props);
    const themeColor = localStorage.getItem('C7N-THEME-COLOR');
    this.updateTheme(themeColor);
  }

  componentWillReceiveProps(nextProps) {
    this.initMenuType(nextProps);
  }

  componentDidMount() {
    const { pathname } = this.props.location;
    const { getUserId } = this.props.AppState;
    this.initFavicon();
    // if (pathname.includes('access_token') && pathname.includes('token_type') && localStorage.getItem(`historyPath-${getUserId}`)) {
    //   window.location = `/#${localStorage.getItem(`historyPath-${getUserId}`)}`;
    // }
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
      return arr.some(v => pathname.startsWith(v));
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
      link.href = data.favicon || 'favicon.ico';
      document.head.appendChild(link);
      data.defaultTitle = document.getElementsByTagName('title')[0].innerText;
      if (data.systemTitle) {
        document.getElementsByTagName('title')[0].innerText = data.systemTitle;
      }
      AppState.setSiteInfo(data);
      this.updateTheme(data.themeColor);
      localStorage.setItem('C7N-THEME-COLOR', data.themeColor);
    });
  }

  initMenuType(props) {
    const { location, MenuStore, HeaderStore, history, AppState } = props;
    const { pathname, search } = location;
    let isUser = false;
    let needLoad = false;
    let menuType = parseQueryToMenuType(search);
    if (pathname === '/') {
      const recent = HeaderStore.getRecentItem;
      if (recent.length && !sessionStorage.home_first_redirect) {
        const { id, name, type, organizationId } = recent[0];
        menuType = { id, name, type, organizationId };
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
      async function goSafty() {
        if (!HeaderStore.getOrgData) {
          setTimeout(() => {
            goSafty();
          }, 500);
        } else {
          message.info('地址过期');
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
          try {res = await axios.get(`/iam/choerodon/v1/projects/${menuType.projectId}/basic_info`);
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
        if (checkArray.some(c => {
          if (menuType[c] && menuType[c] !== 'undefined' && String(menuType[c]) !== String(res[c])) {
            return true;
          }
        })) {
          goSafty();
          return true;
        }
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

  render() {
    const { AutoRouter, AppState } = this.props;
    if (this.isInOutward(this.props.location.pathname)) {
      return (
        <div className="page-wrapper">
          <RouteIndex AutoRouter={AutoRouter} />
        </div>
      );
    } else {
      return (
        AppState.isAuth && AppState.currentMenuType ? (
          <div className="page-wrapper">
            <div className="page-header">
              <AnnouncementBanner />
              <MasterHeader />
            </div>
            <div className="page-body">
              <div className="content-wrapper">
                <div id="menu">
                  <CommonMenu />
                </div>
                <div id="autoRouter" className="content">
                  <RouteIndex AutoRouter={AutoRouter} />
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
}

export default Masters;
