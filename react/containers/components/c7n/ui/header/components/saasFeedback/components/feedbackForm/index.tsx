import React from 'react';
import { useSaaSFeedbackStore } from '../../stores';

const SaaSFeedbackForm = () => {
  const {

  } = useSaaSFeedbackStore();
  return (
    <iframe
      id="test-feedback"
      name="test"
      src="https://open.hand-china.com/feedback?token=XXXXX"
      width="100%"
      height="100%"
      frameBorder="0"
      marginWidth={0}
      style={{ margin: 0, padding: 0, display: 'block' }}
    />
  );
};

export default SaaSFeedbackForm;
