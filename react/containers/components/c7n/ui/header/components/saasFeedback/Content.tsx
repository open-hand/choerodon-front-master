import React, { useEffect } from 'react';
import { Icon } from 'choerodon-ui/pro';
import { useSaaSFeedbackStore } from './stores';
import FeedbackModal from './components/feedbackModal';

const FeedbackItem = () => {
  const {
    prefixCls,
    mainStore,
  } = useSaaSFeedbackStore();

  useEffect(() => {

  }, []);

  function toggleFeedBackModal() {
    mainStore.setOpen(!mainStore.isOpen);
  }

  return (
    <div
      className={prefixCls}
      role="none"
      onClick={toggleFeedBackModal}
    >
      <Icon type="headset_mic-o" />
      <span>
        在线支持
      </span>
      <FeedbackModal />
    </div>
  );
};
export default FeedbackItem;
