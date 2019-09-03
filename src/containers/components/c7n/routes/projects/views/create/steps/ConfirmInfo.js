import React, { useState } from 'react';
import { Form, Output } from 'choerodon-ui/pro';

export default function FormView({ context }) {
  const { dataSet } = context;

  return (
    <Form
      record={dataSet.current}
      style={{ width: '5.12rem' }}
      labelLayout="horizontal"
      labelWidth={145}
      labelAlign="left"
    >
      <Output name="category" />
      <Output name="code" />
      <Output name="name" />
      <Output name="applicationCode" />
      <Output name="applicationName" />
      {/* <Output name="createType" /> */}
    </Form>
  );
}
