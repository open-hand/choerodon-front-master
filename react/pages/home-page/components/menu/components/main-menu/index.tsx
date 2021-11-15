import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import { useMenuStore } from '../../stores';

export type MainMenuProps = {

}

const prefixCls = 'c7ncd-main-menu';
const intlPrefix = 'c7ncd.main.menu';

const MainMenu:FC<MainMenuProps> = () => {
  const {
    type,
  } = useMenuStore();

  useEffect(() => {

  }, []);

  return (
    <div className={prefixCls}>
      MainMenu
    </div>
  );
};

export default observer(MainMenu);
