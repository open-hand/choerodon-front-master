import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { Button, Icon } from 'choerodon-ui';
import {
  Form, TextField, Select, Tooltip, SelectBox, DatePicker,
} from 'choerodon-ui/pro';
import { fileServer } from '@/utils';
import AvatarUploader from './avatarUploader';
import './form.less';

const { Option } = Select;

export default function FormView({ context }) {
  const { dataSet, AppState, intl } = context;
  const [isShowAvatar, setIsShowAvatar] = useState(false);
  const [category, setCategory] = useState(dataSet.current.get('category'));

  function openAvatarUploader() {
    setIsShowAvatar(true);
  }

  function closeAvatarUploader() {
    setIsShowAvatar(false);
  }

  function handleUploadOk(res) {
    const record = dataSet.current;
    record.set('imageUrl', res);
    closeAvatarUploader();
  }

  function renderAvatar() {
    const record = dataSet.current;
    const name = record.get('name');
    const imageUrl = record.get('imageUrl');

    return (
      <>
        <div className="c7n-master-projectsetting-avatar">
          <div
            className="c7n-master-projectsetting-avatar-wrap"
            style={{
              backgroundColor: '#c5cbe8',
              backgroundImage: imageUrl ? `url('${fileServer(imageUrl)}')` : '',
            }}
          >
            {!imageUrl && name && name.charAt(0)}
            <Button
              className={classnames('c7n-master-projectsetting-avatar-button', 'c7n-master-projectsetting-avatar-button-edit')}
              onClick={openAvatarUploader}
            >
              <div className="c7n-master-projectsetting-avatar-button-icon">
                <Icon type="photo_camera" />
              </div>
            </Button>
            <AvatarUploader
              AppState={AppState}
              intl={intl}
              visible={isShowAvatar}
              intlPrefix="organization.project.avatar.edit"
              onVisibleChange={closeAvatarUploader}
              onUploadOk={handleUploadOk}
            />
          </div>
        </div>
        <div style={{ margin: '.06rem 0 .2rem 0', textAlign: 'center' }}>项目logo</div>
      </>
    );
  }
  return (
    <>
      {renderAvatar()}
      <Form record={dataSet.current} className="c7n-project-sider">
        <TextField name="name" />
        <TextField name="code" disabled={dataSet.current.status !== 'add'} />
        <Select
          name="category"
          disabled={dataSet.current.status !== 'add'}
          addonAfter={(
            <Tooltip
              title="普通敏捷项目类型中仅包含了敏捷、测试、知识管理等模块的功能；运维项目类型中仅包含了开发、部署等模块的功能；DevOps全流程项目相较于普通敏捷项目，则多出了开发、部署模块的功能。"
              placement="bottomRight"
              arrowPointAtCenter
            >
              <Icon type="help" className="c7n-master-projectsetting-help-icon" />
            </Tooltip>
          )}
          onChange={setCategory}
        />
        {
          dataSet.current.status !== 'add' && [
            <TextField name="creationDate" disabled />,
            <TextField name="createUserName" disabled />,
            <SelectBox name="enabled">
              <Option value>启用</Option>
              <Option value={false}>停用</Option>
            </SelectBox>,
          ]
        }
        {
         dataSet.current.status === 'add' && category === 'WATERFALL' ? [
           <DatePicker name="startTime" />,
           <DatePicker name="endTime" />] : null
        }

      </Form>
    </>
  );
}
