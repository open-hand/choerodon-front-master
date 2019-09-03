import React, { useState } from 'react';
import classnames from 'classnames';
import { Button, Icon } from 'choerodon-ui';
import { Form, TextField, TextArea, Select } from 'choerodon-ui/pro';
import AvatarUploader from '../../../components/avatarUploader';
import { fileServer } from '../../../../../../../common';

export default function FormView({ context }) {
  const { dataSet, AppState, intl } = context;
  const [isShowAvatar, setIsShowAvatar] = useState(false);

  function openAvatarUploader() {
    setIsShowAvatar(true);
  }

  function closeAvatarUploader() {
    setIsShowAvatar(false);
  }

  function handleUploadOk(res) {
    const record = dataSet.current;
    record.set('imgUrl', res);
    closeAvatarUploader();
  }

  return (
    <React.Fragment>
      <Form record={dataSet.current} style={{ width: '5.12rem' }}>
        <TextField name="code" />
        <TextField name="name" />
        <TextField name="applicationCode" />
        <TextField name="applicationName" />
      </Form>
    </React.Fragment>
  );
}
