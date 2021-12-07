import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { useLocation } from 'react-router';
import { useHeaderStore } from './stores';
import HeaderLogo from './components/header-logo';
import ProjectsSelector from './components/projects-selector';
import HeaderMiddleLists from './components/header-middle-lists';
import OrgSelector from './components/org-selector';
import HeaderRightLists from './components/header-right-lists';
import UserEntry from './components/user-avatar';
import useShouldHiddenHead from './hooks/useShouldHiddenHead';
import ExtraButton from './components/extra-button';
import useIsFullPage from '../../hooks/useIsFullPage';

const Header = (props:any) => {
  const {
    prefixCls,
  } = useHeaderStore();

  const {
    AppState,
  } = props;

  const location = useLocation();

  const shouldHiddenHead = useShouldHiddenHead();
  const isFullPage = useIsFullPage();

  useEffect(() => {
    AppState.setCurrentDropDown(AppState.getStarProject, AppState.getRecentUse);
  }, [location]);

  useEffect(() => {
    AppState.getProjects();
  }, []);

  // 这块需要拆出去放到主页面的逻辑里头,等主页面重构完
  useEffect(() => {
    if (!location.pathname.includes('unauthorized')) {
      sessionStorage.setItem('historyPath', location.pathname + location.search);
    }
  }, [location.pathname, location.search]);

  if (shouldHiddenHead || isFullPage) {
    return null;
  }

  return (
    <div className={prefixCls}>
      {/* logo */}
      <HeaderLogo />
      {/* 项目选择框 */}
      <ProjectsSelector />
      {/* 头部路由按钮列表 */}
      <HeaderMiddleLists />
      {/* 升级的按钮 */}
      <ExtraButton />
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
