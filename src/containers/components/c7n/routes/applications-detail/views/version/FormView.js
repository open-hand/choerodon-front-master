import React from 'react';
import { Form, TextField, TextArea, DatePicker } from 'choerodon-ui/pro';

export default function FormView({ context }) {
  const { versionDs } = context;

  return (
    <Form record={versionDs.current}>
      <TextField name="name" />
      <DatePicker name="startDate" clearButton={false} />
      <DatePicker name="releaseDate" />
      <TextArea name="description" />
    </Form>
  );
}
