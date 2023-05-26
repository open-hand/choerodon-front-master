import React, {
  FC,
} from 'react';
import { Icon, Modal } from 'choerodon-ui/pro';
import {} from '@zknow/components';

import { mount, has } from '@choerodon/inject';
import ExternalComponent from '@/components/external-component';
import { useFormatMessage } from '@/hooks';
import { MODAL_WIDTH } from '@/constants';

export type PlatformEntryProps = {

}

const prefixCls = 'c7ncd-invite-entry';
const intlPrefix = 'c7ncd.user.avatar';

const PlatformEntry:FC<PlatformEntryProps> = () => {
  const formatClient = useFormatMessage(intlPrefix);
  const ModalContent = ({ modal }:any) => <ExternalComponent modal={modal} system={{ scope: 'basePro', module: 'base-pro:trialInviteModal' }} />;
  const handleInviteModalOpen = () => {
    const { MIN } = MODAL_WIDTH;
    Modal.open({
      title: formatClient({ id: 'invitation' }),
      maskClosable: true,
      destroyOnClose: true,
      drawer: true,
      style: { width: MIN },
      children: <ModalContent />,
    });
  };

  return window.basePro ? (
    <div className={prefixCls} onClick={handleInviteModalOpen} role="none">
      <Icon type="share" />
      <span>{formatClient({ id: 'invitation' })}</span>
    </div>
  ) : null;
};

export default PlatformEntry;
