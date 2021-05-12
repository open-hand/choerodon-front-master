import {
  Form, SelectBox, TextField, Select,
} from 'choerodon-ui/pro';
import map from 'lodash/map';
import React from 'react';
import { CKEditor } from '@choerodon/components';
import { useSaaSFeedbackFormStore } from './stores';

const { Option } = SelectBox;

const SaaSForm = () => {
  const {
    prefixCls,
    issueType,
    feedbackFormDs,
  } = useSaaSFeedbackFormStore();

  return (
    <div className={prefixCls}>
      <Form columns={2} dataSet={feedbackFormDs}>
        <SelectBox name="issueType" colSpan={1}>
          {
            map(issueType, ({ value, name }) => (
              <Option value={value}>{name}</Option>
            ))
          }
        </SelectBox>
        <Select name="emergency" colSpan={1}>
          <Option value="hellowrld">hellowrld</Option>
        </Select>
        <TextField name="title" colSpan={2} />
      </Form>
      <CKEditor />
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
