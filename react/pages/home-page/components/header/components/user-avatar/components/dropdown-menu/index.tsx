import React, {
  FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui/pro';

import './index.less';
import Avatar from '../avatar';
import { useUserAvatarStore } from '../../stores';
import { logout } from '@/utils';
import PlatformEntry from './components/platform-entry';
import InviteEntry from './components/invitation-entry';
import PersonalEntry from './components/personal-entry';
import LanguageToggleEntry from './components/language-toggle';

export type DropdownMenuProps = {

}

const DropdownMenu:FC<DropdownMenuProps> = () => {
  const {
    imageUrl,
    prefixCls,
    email,
    realName,
    mainStore,
  } = useUserAvatarStore();

  const {
    setMeneVisible,
  } = mainStore;

  const menuItems = [
    <PersonalEntry />,
    <PlatformEntry />,
    <LanguageToggleEntry />,
    <InviteEntry />,
  ];

  const handleMenuItemClick = () => {
    setMeneVisible(false);
  };

  return (
    <div className={`${prefixCls}-popover-content`}>
      <Avatar
        src={imageUrl}
        prefixCls={prefixCls}
      >
        {realName && realName.charAt(0)}
      </Avatar>
      <div className={`${prefixCls}-popover-title`}>
        <span>{realName}</span>
        <span>{email}</span>
      </div>
      <div className={`${prefixCls}-popover-menu`} onClick={handleMenuItemClick} role="none">
        {menuItems}
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
