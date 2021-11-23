import React, {
  FC,
} from 'react';
import { Icon, Modal } from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import { mount, has } from '@choerodon/inject';
import { MODAL_WIDTH } from '@/constants';

export type PlatformEntryProps = {

}

const prefixCls = 'c7ncd-invite-entry';

const ModalContent = ({ modal }:any) => mount('base-pro:trialInviteModal', { modal });

const PlatformEntry:FC<PlatformEntryProps> = () => {
  const handleInviteModalOpen = () => {
    const { MIN } = MODAL_WIDTH;
    Modal.open({
      title: '邀请试用',
      maskClosable: true,
      destroyOnClose: true,
      drawer: true,
      style: { width: MIN },
      children: <ModalContent />,
    });
  };

  return has('base-pro:trialInviteModal') ? (
    <div className={prefixCls} onClick={handleInviteModalOpen} role="none">
      <Icon type="share" />
      <span>邀请试用</span>
    </div>
  ) : null;
};

export default PlatformEntry;
