import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { useHeaderStore } from './stores';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';
import HeaderLogo from './components/header-logo';
import ProjectSelector from './components/project-selector';
import HeaderMiddleLists from './components/header-middle-lists';
import OrgSelector from './components/org-selector';

const Header = observer(() => {
  const {
    mainStore,
    prefixCls,
  } = useHeaderStore();

  useEffect(() => {

  }, []);

  return (
    <div className={prefixCls}>
      {/* logo */}
      <HeaderLogo />
      {/* 项目选择框 */}
      <ProjectSelector />
      <HeaderMiddleLists />
      <OrgSelector />
    </div>
  );
});

export default Header;
