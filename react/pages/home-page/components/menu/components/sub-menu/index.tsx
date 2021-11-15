import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';

export type SubMenuProps = {

}

const prefixCls = 'c7ncd-sub-menu';
const intlPrefix = 'c7ncd.sub.menu';

const SubMenu:FC<SubMenuProps> = (props) => {
  const {

  } = props;

  useEffect(() => {

  }, []);

  return (
    <div className={prefixCls}>
      SubMenu
    </div>
  );
};

export default SubMenu;
