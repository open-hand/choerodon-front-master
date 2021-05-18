import {
  Form, SelectBox, TextField, Select,
} from 'choerodon-ui/pro';
import map from 'lodash/map';
import React, { useState } from 'react';
import { CKEditor } from '@choerodon/components';
import { observer } from 'mobx-react-lite';
import issueMap from './stores/issueMapings';
import { useSaaSFeedbackFormStore } from './stores';

import FeedbackUpload from '../feedbackUpload';

const { Option } = SelectBox;

const SaaSForm = () => {
  const {
    prefixCls,
    issueType,
    feedbackFormDs,
  } = useSaaSFeedbackFormStore();

  const getDefaultMDText = () => {
    const currentIssueType = feedbackFormDs.current?.get('issueType');
    return issueMap.get(currentIssueType)?.mdTextDefault;
  };

  return (
    <div className={prefixCls}>
      <Form columns={2} dataSet={feedbackFormDs}>
        <SelectBox name="issueType" colSpan={1}>
          {
            map(issueType, (value:string) => (
              <Option value={issueMap.get(value)?.value}>{issueMap.get(value)?.name}</Option>
            ))
          }
        </SelectBox>
        <Select name="emergency" colSpan={1} />
        <TextField name="title" colSpan={2} />
        {
          feedbackFormDs.current?.get('issueType') === 'demand' && <Select name="demandType" colSpan={1} />
        }
      </Form>
      <CKEditor defaultValue={getDefaultMDText()} />
      <p className={`${prefixCls}-tip`}>
        注：问题描述编辑框内可以直接粘贴图片喔 ~
      </p>
      <FeedbackUpload />
    </div>
  );
};

export default observer(SaaSForm);
