import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { notification } from 'choerodon-ui';
import {
  Form, TextField, Select, Tooltip, SelectBox, DatePicker, Spin, Modal, Icon, Button,
} from 'choerodon-ui/pro';
import { fileServer, prompt } from '@/utils';
import map from 'lodash/map';
import some from 'lodash/some';
import get from 'lodash/get';
import AvatarUploader from '../avatarUploader';
import { useCreateProjectProStore } from './stores';
import ProjectNotification from './components/project-notification';

import './index.less';

const { Option } = Select;

const CreateProject = observer(() => {
  const {
    formDs, categoryDs, AppState, intl, prefixCls, modal, refresh, categoryCodes, openSagaDetails,
    intl: { formatMessage }, intlPrefix,
    AppState: {
      currentMenuType: {
        organizationId,
      },
    },
  } = useCreateProjectProStore();
  const [isShowAvatar, setIsShowAvatar] = useState(false);

  const record = useMemo(() => formDs.current, [formDs.current]);
  const isModify = useMemo(() => record && record.status !== 'add', [record]);
  const hasWaterfall = useMemo(() => some(categoryDs.selected || [], (eachRecord) => eachRecord.get('code') === categoryCodes.waterfall), [categoryDs.selected]);

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
      if (isModify && record.getPristineValue('enabled') && record.get('enabled') === false) {
        handleEdit();
      } else {
        editProject();
      }
      return false;
    } catch (e) {
      return false;
    }
  });

  const editProject = async () => {
    try {
      modal.update({
        okProps: { loading: true },
      });
      const res = await formDs.submit();
      if (res && !res.failed && res.list && res.list.length) {
        const projectId = get(res.list[0], 'id');
        if (projectId) {
          openNotification({ projectId, operateType: isModify ? 'update' : 'create' });
        }
        modal.close();
        refresh();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const handleEdit = () => {
    try {
      const isSubProject = some(record.getPristineValue('categories'), ['code', categoryCodes.programProject]);
      const isProgram = some(categoryDs.selected, (eachRecord) => eachRecord.get('code') === categoryCodes.program);
      const projectName = record.get('name');
      const okProps = {
        disabled: true,
        color: 'red',
        style: {
          width: '100%', border: '1px solid rgba(27,31,35,.2)', height: 36, marginTop: -26,
        },
      };
      const ModalContent = ({ modal: newModal }) => {
        let extraMessage;
        if (isProgram) {
          extraMessage = (
            <>
              <div className={`${prefixCls}-enable-tips`}>
                警告：项目群停用后，ART将自动停止，子项目和项目群的关联也将自动停用，子项目的迭代节奏、迭代规划不再受到ART的统一管理。ART下进行中的PI将直接完成，未完成的PI将会删除，未完成的特性将会移动至待办。子项目进行中的迭代会直接完成，未开始的冲刺将会删除，未完成的问题将会移动至待办。请谨慎操作！
              </div>
              <div style={{ marginTop: 10 }}>
                请输入
                {' '}
                <span style={{ fontWeight: 600 }}>{projectName}</span>
                {' '}
                来确认停用。
              </div>
              <TextField
                style={{ width: '100%', marginTop: 10 }}
                autoFocus
                onInput={(e) => {
                  newModal.update({
                    okProps: {
                      ...okProps,
                      disabled: e.target.value !== projectName,
                    },
                  });
                }}
              />
            </>
          );
        } else if (isSubProject) {
          extraMessage = (
            <div className={`${prefixCls}-enable-tips`}>
              警告：子项目停用后，与项目群相关的冲刺将发生变动，进行中的冲刺会直接完成，未开始的冲刺将会删除，未完成的问题将会移动至待办。请谨慎操作！
            </div>
          );
        }
        const content = (
          <div style={{ marginTop: -10 }}>
            {isProgram && (
              <p style={{
                marginBottom: 14,
                background: '#fffbdd',
                padding: '15px 26px',
                border: '1px solid rgba(27,31,35,.15)',
                width: 'calc(100% + 49px)',
                marginLeft: -25,
              }}
              >
                请仔细阅读下列事项！
              </p>
            )}
            <span>
              确定要停用项目“
              {projectName}
              ”吗？停用后，您和项目下其他成员将无法进入此项目。
            </span>
            {extraMessage}
          </div>
        );
        return content;
      };
      if (isProgram) {
        Modal.open({
          title: '停用项目',
          children: <ModalContent />,
          onOk: editProject,
          okProps,
          okText: '我已经知道后果，停用此项目',
          closable: true,
          footer: (okBtn) => okBtn,
        });
      } else {
        Modal.open({
          title: '停用项目',
          children: <ModalContent />,
          onOk: editProject,
        });
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const openNotification = useCallback(({ projectId, operateType }) => {
    const notificationKey = `${organizationId}-${projectId}`;
    notification.open({
      key: notificationKey,
      message: <span className={`${prefixCls}-notification-title`}>{isModify ? '修改项目' : '创建项目'}</span>,
      description: <ProjectNotification
        notificationKey={notificationKey}
        organizationId={organizationId}
        projectId={projectId}
        operateType={operateType}
        formatMessage={formatMessage}
        intlPrefix={intlPrefix}
        refresh={refresh}
      />,
      duration: null,
      placement: 'bottomLeft',
      className: `${prefixCls}-notification`,
    });
  }, []);

  const changeAvatarUploader = useCallback((flag) => {
    setIsShowAvatar(flag);
  }, []);

  const handleUploadOk = useCallback((res) => {
    record.set('imageUrl', res);
    changeAvatarUploader(false);
  }, [record]);

  const handleCategoryClick = useCallback((categoryRecord) => {
    if (categoryRecord.getState('disabled')) {
      return;
    }
    if (categoryRecord.get('code') === categoryCodes.require) {
      categoryRecord.setState('isEdit', true);
    }
    if (categoryRecord.isSelected) {
      categoryDs.unSelect(categoryRecord);
    } else {
      categoryDs.select(categoryRecord);
    }
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

  const getCategoryClassNames = useCallback((categoryRecord) => (classnames({
    [`${prefixCls}-category-item`]: true,
    [`${prefixCls}-category-item-disabled`]: categoryRecord.getState('disabled'),
    [`${prefixCls}-category-item-selected`]: categoryRecord.isSelected,
  })), []);

  const getTooltipContent = useCallback((categoryRecord) => {
    const code = categoryRecord.get('code');
    if (!categoryRecord.getState('disabled')) {
      return '';
    }
    if (code === categoryCodes.require) {
      return '请先选择【敏捷管理】或【敏捷项目群】项目类型';
    }
    if (categoryRecord.isSelected) {
      if (code === categoryCodes.program) {
        return '项目群中存在子项目，无法移除此项目类型';
      }
      if (code === categoryCodes.agile) {
        return '敏捷管理项目已加入项目群，无法移除此项目类型';
      }
    } else {
      if (code === categoryCodes.program && !some(categoryDs.selected || [], (eachRecord) => eachRecord.get('code') === categoryCodes.agile)) {
        return '【敏捷管理】类型无法修改为【敏捷项目群】类型';
      }
      if (code === categoryCodes.agile && !some(categoryDs.selected || [], (eachRecord) => eachRecord.get('code') === categoryCodes.program)) {
        return '【敏捷项目群】类型无法修改为【敏捷管理】类型';
      }
      return '不可同时选择【敏捷管理】与【规模化敏捷项目群】项目类型';
    }
    return '';
  }, []);

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
          <Tooltip title={getTooltipContent(categoryRecord)} key={categoryRecord.get('code')}>
            <div
              className={getCategoryClassNames(categoryRecord)}
              onClick={() => handleCategoryClick(categoryRecord)}
              role="none"
            >
              <div className={`${prefixCls}-category-item-icon ${prefixCls}-category-item-icon-${categoryRecord.get('code')}`} />
              <span>{categoryRecord.get('name')}</span>
            </div>
          </Tooltip>
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
