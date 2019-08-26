import React from 'react';
import { Form, TextField, TextArea, DatePicker } from 'choerodon-ui/pro';

export default function FormView({ context }) {
  const { versionDs } = context;

  return (
    <Form record={versionDs.current}>
      <TextField name="name" />
      <DatePicker name="startTime" />
      <DatePicker name="publishTime" />
      <TextArea name="description" />
    </Form>
  );
}
