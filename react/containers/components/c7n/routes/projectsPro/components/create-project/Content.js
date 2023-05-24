import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { notification, message } from 'choerodon-ui';
import {
  Form, TextField, Tooltip, Spin, Icon, Button, TextArea, CheckBox, Select,
} from 'choerodon-ui/pro';
import {
  includes, map, get, some,
} from 'lodash';
import { NewTips } from '@choerodon/components';
import { get as getInject } from '@choerodon/inject';
import { fileServer, prompt } from '@/utils';
import axios from '@/components/axios';
import AvatarUploader from '../avatarUploader';
import { useCreateProjectProStore } from './stores';
import ProjectNotification from './components/project-notification';

import './index.less';

const { Option } = Select;
const HAS_AGILEPRO = C7NHasModule('@choerodon/agile-pro');
const HAS_BASE_BUSINESS = C7NHasModule('@choerodon/base-business');

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

  useEffect(() => {
    modal.update({
      okProps: { loading: isLoading },
      cancelProps: { disabled: isLoading },
    });
  }, [isLoading]);

  useEffect(() => {
    const loadTemplateConfig = async () => {
      if (!HAS_AGILEPRO) {
        return;
      }
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
      if (typeof formDs?.current?.get('statusId') === 'object') {
        formDs?.current?.set('statusId', formDs?.current?.get('statusId')?.id);
      }
      record.set('categories', categories);
      if (some(categories, ['code', 'N_WATERFALL'])) {
        record.set('useTemplate', false);
      }
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
      return '仅SaaS企业版可选此项目类型';
    }
    if (code === categoryCodes.require) {
      return '请先选择【敏捷管理】或【敏捷项目群】或【瀑布管理】项目类型';
    }
    if (categoryRecord.isSelected && isModify) {
      if (code === categoryCodes.program) {
        return '项目群中存在子项目，无法移除此项目类型';
      }
      if (code === categoryCodes.agile) {
        return '敏捷管理项目已加入项目群，无法移除此项目类型';
      }
    } else {
      if (isModify) {
        if (code === categoryCodes.waterfall && (categoryDs.getState('isBeforeAgile') || categoryDs.getState('isBeforeProgram'))) {
          return '已添加或添加过【敏捷管理】/【敏捷项目群】项目类型，不可添加【瀑布管理】项目类型';
        }
        if (code === categoryCodes.program && ((categoryDs.getState('isBeforeAgile') && !categoryDs.getState('isBeforeProgram')) || categoryDs.getState('isBeforeWaterfall'))) {
          return '已添加或添加过【敏捷管理】/ 【瀑布管理】项目类型，不可添加【敏捷项目群】项目类型';
        }
        if (code === categoryCodes.agile && ((categoryDs.getState('isBeforeProgram') && !categoryDs.getState('isProgram')) || categoryDs.getState('isBeforeWaterfall'))) {
          return '已添加或添加过【敏捷项目群】/ 【瀑布管理】项目类型，不可添加【敏捷管理】项目类型';
        }
      }
      if ([categoryCodes.program, categoryCodes.waterfall, categoryCodes.agile].indexOf(code) !== -1) {
        return '不可同时选择敏捷管理/敏捷项目群与瀑布管理项目类型';
      }
      return '不可同时选择【敏捷管理】与【规模化敏捷项目群】项目类型';
    }
    return '';
  }, [createProjectStore.getIsSenior, isModify]);

  const handleOpenTemplate = useCallback(() => {
    getInject('agile:openTemplate')({});
  }, []);

  if (!record) {
    return <Spin spinning />;
  }

  const sprintCheckboxOnChange = (value) => {
    formDs?.current?.set('agileWaterfall', value);
  };

  const renderStatus = ({ record: hereRecord, value, text }) => {
    const arr = hereRecord?.getField('statusId')?.options?.toData();
    const index = arr.findIndex((item) => item.id === hereRecord?.get('statusId')?.id);
    if (index === -1) {
      return hereRecord?.get('statusName');
    }
    return text;
  };

  const selectedRecords = categoryDs.selected;
  const selectedCategoryCodes = map(selectedRecords, (selectedRecord) => selectedRecord.get('code'));

  return (
    <>
      {renderAvatar()}
      <Form record={record} className={`${prefixCls}-form`} labelLayout="float">
        <TextField name="name" />
        <TextField name="code" disabled={isModify} />
        {/* <Select name="aaa">
          <Option value="jack">新品</Option>
          <Option value="jack1">包装升级</Option>
        </Select>
        <Select name="bbb">
          <Option value="jack">柔润修护润唇膏屈臣氏陈列版本</Option>
          <Option value="jack">舒缓保湿氨基酸洁面泡沫</Option>
          <Option value="jack">敏肌修护镜湖水</Option>
          <Option value="jack">清痘调理水</Option>
        </Select> */}

        {/*  合并时候改成window.baseBusiness */}
        {
          isModify && HAS_BASE_BUSINESS && <Select name="statusId" renderer={renderStatus} />
        }

        <TextArea name="description" resize="vertical" />
        {
          isModify && [
            <TextField name="creationDate" disabled />,
            <TextField name="createUserName" disabled />,
          ]
        }
      </Form>
      <div className={`${prefixCls}-category-label`}>项目类型</div>
      <div className={`${prefixCls}-category`}>
        {categoryDs.map((categoryRecord) => (
          <div>
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
            {categoryRecord.get('code') === 'N_WATERFALL'
              && categoryRecord.isSelected && (
              <div
                role="none"
                className={`${prefixCls}-category-exception`}
                onClick={(e) => { e.stopPropagation(); }}
              >
                <CheckBox checked={record?.get('agileWaterfall')} onChange={sprintCheckboxOnChange} />
                <span style={{
                  marginLeft: 4.25, fontSize: 12, position: 'relative', top: -1,
                }}
                >
                  启用冲刺
                </span>
                <NewTips
                  helpText="启用冲刺适用于大瀑布小敏捷场景， 启用后可使用任务看板，故事地图等功能"
                  style={{
                    marginLeft: 3.17,
                    position: 'relative',
                  }}
                />
              </div>
            )}
          </div>
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
