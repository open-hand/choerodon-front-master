import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { notification, message } from 'choerodon-ui';
import {
  Form, TextField, Tooltip, DatePicker, Spin, Icon, Button, TextArea, CheckBox,
} from 'choerodon-ui/pro';
import {
  includes, map, some, get,
} from 'lodash';
import { get as getInject } from '@choerodon/inject';
import { fileServer, prompt } from '@/utils';
import axios from '@/containers/components/c7n/tools/axios';
import AvatarUploader from '../avatarUploader';
import { useCreateProjectProStore } from './stores';
import ProjectNotification from './components/project-notification';

import './index.less';

const CreateProject = observer(() => {
  const {
    formDs, categoryDs, AppState, intl, prefixCls, modal, refresh, categoryCodes,
    intl: { formatMessage }, intlPrefix,
    AppState: {
      currentMenuType: {
        organizationId,
      },
    },
    projectId: currentProjectId,
    createProjectStore,
    standardDisable,
  } = useCreateProjectProStore();
  const [isShowAvatar, setIsShowAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templateTabsKey, setTemplateTabsKey] = useState([]);
  const [hasConfiged, setHasConfiged] = useState(false);

  const record = useMemo(() => formDs.current, [formDs.current]);
  const isModify = useMemo(() => record && record.status !== 'add', [record]);
  const hasWaterfall = useMemo(() => some(categoryDs.selected || [], (eachRecord) => eachRecord.get('code') === categoryCodes.waterfall), [categoryDs.selected]);

  useEffect(() => {
    modal.update({
      okProps: { loading: isLoading },
      cancelProps: { disabled: isLoading },
    });
  }, [isLoading]);

  useEffect(() => {
    const loadTemplateConfig = async () => {
      let notConfigured = true;
      if (currentProjectId) {
        notConfigured = await axios.get(`/agile/v1/organizations/${organizationId}/organization_config/check_configured?projectId=${currentProjectId}`);
        setHasConfiged(!notConfigured);
      }
      if (!currentProjectId || (currentProjectId && notConfigured)) {
        axios.get(`/agile/v1/organizations/${organizationId}/organization_config/check_config_template`).then((res) => {
          if (res.statusMachineTemplateConfig) {
            if (res.boardTemplateConfig) {
              setTemplateTabsKey(['statusMachineTemplate', 'boardTemplate']);
            } else {
              setTemplateTabsKey(['statusMachineTemplate']);
            }
          }
        });
      }
    };

    loadTemplateConfig();
  }, [currentProjectId, organizationId]);

  modal.handleOk(async () => {
    try {
      setIsLoading(true);
      const selectedRecords = categoryDs.selected;
      if (!selectedRecords || !selectedRecords.length) {
        prompt('请至少选择一个项目类型');
        setIsLoading(false);
        return false;
      }
      const categories = map(selectedRecords, (selectedRecord) => ({
        id: selectedRecord.get('id'),
        code: selectedRecord.get('code'),
      }));
      record.set('categories', categories);
      const res = await formDs.submit();
      if (res && !res.failed && res.list && res.list.length) {
        const projectId = get(res.list[0], 'id');
        if (projectId) {
          openNotification({ projectId, operateType: isModify ? 'update' : 'create' });
        }
        refresh(projectId);
        return true;
      } if (res.failed) {
        message.error(res.message);
      }
      setIsLoading(false);
      return false;
    } catch (e) {
      setIsLoading(false);
      return false;
    }
  });

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
    if (!createProjectStore.getIsSenior && standardDisable.includes(code)) {
      return '仅SaaS高级版可选此项目类型';
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
        return '原项目曾经为【敏捷管理】项目，不支持调整为【敏捷项目群】类型';
      }
      if (code === categoryCodes.agile && !some(categoryDs.selected || [], (eachRecord) => eachRecord.get('code') === categoryCodes.program)) {
        return '原项目曾经为【敏捷项目群】项目，不支持调整为【敏捷管理】类型';
      }
      return '不可同时选择【敏捷管理】与【规模化敏捷项目群】项目类型';
    }
    return '';
  }, [createProjectStore.getIsSenior]);

  const handleOpenTemplate = useCallback(() => {
    getInject('agile:openTemplate')({});
  }, []);

  if (!record) {
    return <Spin spinning />;
  }

  const selectedRecords = categoryDs.selected;
  const selectedCategoryCodes = map(selectedRecords, (selectedRecord) => selectedRecord.get('code'));

  return (
    <>
      {renderAvatar()}
      <Form record={record} className={`${prefixCls}-form`} labelLayout="float">
        <TextField name="name" />
        <TextField name="code" disabled={isModify} />
        <TextArea name="description" resize="vertical" />
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
      <div className={`${prefixCls}-template`}>
        {
          (!currentProjectId || (currentProjectId && !hasConfiged)) && selectedCategoryCodes.find((item) => item === 'N_AGILE') && includes(templateTabsKey, 'statusMachineTemplate') && (
            <>
              <CheckBox dataSet={formDs} name="useTemplate" value className={`${prefixCls}-template-checkbox`}>使用组织预置的状态机及看板模板</CheckBox>
              <div
                className={`${prefixCls}-template-btn`}
                role="none"
                onClick={handleOpenTemplate}
              >
                查看模板
              </div>
            </>
          )
        }
      </div>
    </>
  );
});

export default CreateProject;
