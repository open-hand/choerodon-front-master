import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { Button, Icon } from 'choerodon-ui';
import {
  Form, TextField, Select, Tooltip, SelectBox, DatePicker, Spin,
} from 'choerodon-ui/pro';
import { fileServer, prompt } from '@/utils';
import map from 'lodash/map';
import some from 'lodash/some';
import AvatarUploader from '../avatarUploader';
import { useCreateProjectProStore } from './stores';

import './index.less';

const { Option } = Select;

const CreateProject = observer(() => {
  const {
    formDs, categoryDs, AppState, intl, prefixCls, modal, refresh,
  } = useCreateProjectProStore();
  const [isShowAvatar, setIsShowAvatar] = useState(false);

  const record = useMemo(() => formDs.current, [formDs.current]);
  const isModify = useMemo(() => record && record.status !== 'add', [record]);
  const hasWaterfall = useMemo(() => {
    if (!record) {
      return false;
    }
    return some(record.get('categories') || [], ({ code }) => code === 'WATERFALL');
  }, [record]);

  modal.handleOk(async () => {
    try {
      const selectedRecords = categoryDs.selected;
      if (!selectedRecords || !selectedRecords.length) {
        prompt('请至少选择一个项目类型');
        return false;
      }
      const categories = map(selectedRecords, (selectedRecord) => ({
        id: selectedRecord.get('id'),
        code: selectedRecord.get('code'),
      }));
      record.set('categories', categories);
      if (await formDs.submit() !== false) {
        refresh();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  });

  const changeAvatarUploader = useCallback((flag) => {
    setIsShowAvatar(flag);
  }, []);

  const handleUploadOk = useCallback((res) => {
    record.set('imageUrl', res);
    changeAvatarUploader(false);
  }, [record]);

  const handleCategoryClick = useCallback((categoryRecord) => {
    // eslint-disable-next-line no-param-reassign
    categoryRecord.isSelected = !categoryRecord.isSelected;
  }, []);

  const renderAvatar = useCallback(() => {
    const name = record.get('name');
    const imageUrl = record.get('imageUrl');

    return (
      <>
        <div className={`${prefixCls}-avatar`}>
          <div
            className={`${prefixCls}-avatar-wrap`}
            style={{
              backgroundColor: '#c5cbe8',
              backgroundImage: imageUrl ? `url('${fileServer(imageUrl)}')` : '',
            }}
          >
            {!imageUrl && name && name.charAt(0)}
            <Button
              className={classnames(`${prefixCls}-avatar-button`, `${prefixCls}-avatar-button-edit`)}
              onClick={() => changeAvatarUploader(true)}
            >
              <div className={`${prefixCls}-avatar-button-icon`}>
                <Icon type="photo_camera" />
              </div>
            </Button>
            <AvatarUploader
              AppState={AppState}
              intl={intl}
              visible={isShowAvatar}
              intlPrefix="organization.project.avatar.edit"
              onVisibleChange={() => changeAvatarUploader(false)}
              onUploadOk={handleUploadOk}
            />
          </div>
        </div>
        <div style={{ margin: '.06rem 0 .2rem 0', textAlign: 'center' }}>项目logo</div>
      </>
    );
  }, [record, isShowAvatar, AppState]);

  if (!record) {
    return <Spin spinning />;
  }

  return (
    <>
      {renderAvatar()}
      <Form record={record} className={`${prefixCls}-form`} labelLayout="float">
        <TextField name="name" />
        <TextField name="code" disabled={isModify} />
        {
          isModify && [
            <TextField name="creationDate" disabled />,
            <TextField name="createUserName" disabled />,
            (record.get('category') === 'WATERFALL' ? ([
              <DatePicker name="startTime" />,
              <DatePicker name="endTime" />,
            ]) : null),
          ]
        }
        {!isModify && hasWaterfall ? ([
          <DatePicker name="startTime" />,
          <DatePicker name="endTime" />,
        ]) : null}
      </Form>
      <div className={`${prefixCls}-category-label`}>项目类型</div>
      <div className={`${prefixCls}-category`}>
        {categoryDs.map((categoryRecord) => (
          <div
            className={`${prefixCls}-category-item ${categoryRecord.isSelected ? `${prefixCls}-category-item-selected` : ''}`}
            onClick={() => handleCategoryClick(categoryRecord)}
            role="none"
          >
            <div className={`${prefixCls}-category-item-icon ${prefixCls}-category-item-icon-${categoryRecord.get('code')}`} />
            <span>{categoryRecord.get('name')}</span>
          </div>
        ))}
      </div>
      {isModify && (
        <Form record={record} className={`${prefixCls}-form`} labelLayout="float">
          <SelectBox name="enabled">
            <Option value>启用</Option>
            <Option value={false}>停用</Option>
          </SelectBox>
        </Form>
      )}
    </>
  );
});

export default CreateProject;
