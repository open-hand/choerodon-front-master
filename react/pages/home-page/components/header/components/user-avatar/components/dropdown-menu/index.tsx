import React, {
  FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Menu } from 'choerodon-ui/pro';

import './index.less';
import { useHistory } from 'react-router';
import Avatar from '../avatar';
import { useUserAvatarStore } from '../../stores';
import { logout } from '@/utils';
import PlatformEntry from './components/platform-entry';
import InviteEntry from './components/invitation-entry';
import PersonalEntry from './components/personal-entry';
import { USERINFO_PATH } from '@/constants';

const MenuItem = Menu.Item;

export type DropdownMenuProps = {

}

const DropdownMenu:FC<DropdownMenuProps> = () => {
  const {
    imageUrl,
    organizationId,
    prefixCls,
    email,
    realName,
    mainStore,
  } = useUserAvatarStore();

  const {
    setMeneVisible,
  } = mainStore;

  const history = useHistory();

  const menuItems = [
    PersonalEntry,
    PlatformEntry,
    InviteEntry,
  ];

  const handleMenuItemClick = () => {
    setMeneVisible(false);
  };

  const renderItems = () => menuItems.map((component, index:number) => (
    [
      !!index && <Menu.Divider />,
      <MenuItem className={`${prefixCls}-popover-menu-item`}>
        {React.createElement(component)}
      </MenuItem>,
    ].filter(Boolean)
  ));

  return (
    <div className={`${prefixCls}-popover-content`}>
      <Avatar
        src={imageUrl}
        prefixCls={prefixCls}
        onClick={() => {
          history.push(`${USERINFO_PATH}?type=user&organizationId=${organizationId}`);
        }}
      >
        {realName && realName.charAt(0)}
      </Avatar>
      <div className={`${prefixCls}-popover-title`}>
        <span>{realName}</span>
        <span>{email}</span>
      </div>
      <div className={`${prefixCls}-popover-menu`}>
        <Menu onClick={handleMenuItemClick}>
          {renderItems()}
        </Menu>
      </div>
      <div className="divider" />
      <div className={`${prefixCls}-popover-logout`}>
        <li
          role="none"
          onClick={logout}
        >
          <Icon type="exit_to_app" />
          退出登录
        </li>
      </div>
    </div>
  );
};

export default observer(DropdownMenu);
