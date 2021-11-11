import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { Menu, Popover, Icon } from 'choerodon-ui';
import { Modal } from 'choerodon-ui/pro';
import { useUserAvatarStore } from './stores';

import {} from '@choerodon/components';
import Avatar from './components/avatar';
import DropdownMenu from './components/dropdown-menu';

const UserAvatar = (props:any) => {
  const {
    mainStore,
    prefixCls,
    realName,
    imageUrl,
  } = useUserAvatarStore();

  const {
    menuVisible,
    setMeneVisible,
  } = mainStore;

  useEffect(() => {

  }, []);

  return (
    <Popover
      overlayClassName={`${prefixCls}-popover`}
      content={<DropdownMenu />}
      trigger="click"
      visible={menuVisible}
      placement="bottomRight"
      onVisibleChange={setMeneVisible}
    >
      <Avatar src={imageUrl} prefixCls={prefixCls}>
        {realName && realName.charAt(0)}
      </Avatar>
    </Popover>
  );
};

export default observer(UserAvatar);
