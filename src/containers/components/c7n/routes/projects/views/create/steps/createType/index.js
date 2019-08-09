import React, { useState } from 'react';
import { Tabs } from 'choerodon-ui';
import { Form, TextField } from 'choerodon-ui/pro';
import NewTab from './tabpanes/NewTab';
import ExistTab from './tabpanes/exist-tab';

const { TabPane } = Tabs;

export default function FormView(props) {
  // const { dataSet } = props.context;

  return (
    <Tabs>
      <TabPane tab="创建空白应用" key="1"><NewTab {...props} /></TabPane>
      <TabPane tab="基于已有应用" key="2"><ExistTab {...props} /></TabPane>
    </Tabs>
  );
}
