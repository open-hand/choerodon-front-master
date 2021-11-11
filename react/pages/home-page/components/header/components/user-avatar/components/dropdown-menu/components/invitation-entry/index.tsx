import React, {
  FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Modal } from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import { MODAL_WIDTH } from '@/constants';
import InvitationModal from './components/invite-modal';

export type PlatformEntryProps = {

}

const prefixCls = 'c7ncd-invite-entry';

const PlatformEntry:FC<PlatformEntryProps> = (props) => {
  const handleInviteModalOpen = () => {
    const { MIN } = MODAL_WIDTH;
    Modal.open({
      title: '注册邀请',
      maskClosable: true,
      destroyOnClose: true,
      drawer: true,
      style: { width: MIN },
      children: <InvitationModal />,
    });
  };

  return (
    <div className={prefixCls} onClick={handleInviteModalOpen} role="none">
      <Icon type="share" />
      <span>注册邀请</span>
    </div>
  );
};

export default PlatformEntry;
