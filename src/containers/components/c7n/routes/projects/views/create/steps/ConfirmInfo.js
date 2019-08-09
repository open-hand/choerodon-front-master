import React, { useState } from 'react';
import { Form, Output } from 'choerodon-ui/pro';

export default function FormView({ context }) {
  const { dataSet } = context;

  return (
    <Form record={dataSet.current} style={{ width: '5.12rem' }} labelLayout="horizontal">
      <Output name="category" />
      <Output name="name" />
      <Output name="code" />
      <Output name="appCode" />
      <Output name="appName" />
      <Output name="createType" />
    </Form>
  );
}
