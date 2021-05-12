import { Form } from 'choerodon-ui';
import { TextField } from 'choerodon-ui/pro';
import React from 'react';
import { useSaaSFeedbackFormStore } from './stores';

const SaaSForm = () => {
  const {
    prefixCls,
  } = useSaaSFeedbackFormStore();

  return (
    <div className={prefixCls}>
      <Form>
        <TextField />
      </Form>
    </div>
  );
};

export default SaaSForm;

// <iframe
    //   id="test-feedback"
    //   name="test"
    //   src="https://open.hand-china.com/feedback?token=14d4a3e7-65ba-4104-98bb-7951512b6a04"
    //   width="100%"
    //   height="100%"
    //   frameBorder="0"
    //   marginWidth={0}
    //   style={{ margin: 0, padding: 0, display: 'block' }}
    // />
