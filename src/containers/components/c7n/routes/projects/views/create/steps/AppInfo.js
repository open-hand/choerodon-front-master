import React, { useState } from 'react';
import { Form, TextField } from 'choerodon-ui/pro';

export default function FormView({ context }) {
  const { dataSet } = context;

  return (
    <Form record={dataSet.current} style={{ width: '5.12rem' }}>
      <TextField name="appCode" />
      <TextField name="appName" />
    </Form>
  );
}
