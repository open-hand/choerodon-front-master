import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { useLocation } from 'react-router';
import { useHeaderStore } from './stores';
import HeaderLogo from './components/header-logo';
import ProjectSelector from './components/project-selector';
import HeaderMiddleLists from './components/header-middle-lists';
import OrgSelector from './components/org-selector';
import HeaderRightLists from './components/header-right-lists';
import UserEntry from './components/user-avatar';

const Header = (props:any) => {
  const {
    mainStore,
    prefixCls,
  } = useHeaderStore();

  const {
    AppState,
  } = props;

  const location = useLocation();

  useEffect(() => {
    AppState.setCurrentDropDown(AppState.getStarProject, AppState.getRecentUse);
  }, [location]);

  useEffect(() => {
    AppState.getProjects();
  }, []);

  useEffect(() => {
    if (!location.pathname.includes('unauthorized')) {
      sessionStorage.setItem('historyPath', location.pathname + location.search);
    }
  }, [location.pathname, location.search]);

  const shouldHiddenHead = () => {
    const defaultBlackList = ['/iam/enterprise'];
    if (defaultBlackList.some((pname) => location.pathname.startsWith(pname))) {
      return true;
    }
    return false;
  };

  if (shouldHiddenHead()) {
    return null;
  }

  return (
    <div className={prefixCls}>
      {/* logo */}
      <HeaderLogo />
      {/* 项目选择框 */}
      <ProjectSelector />
      {/* 头部路由按钮列表 */}
      <HeaderMiddleLists />
      {/* 组织选择框 */}
      <OrgSelector />
      {/* 右侧Icon列表 */}
      <HeaderRightLists />
      {/* 用户头像 */}
      <UserEntry />
    </div>
  );
};

export default inject('AppState')(observer(Header));
