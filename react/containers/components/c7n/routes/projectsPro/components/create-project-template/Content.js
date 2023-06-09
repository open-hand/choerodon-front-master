/* eslint-disable object-shorthand */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { notification, message, Alert } from 'choerodon-ui';
import {
  Form,
  TextField,
  Tooltip,
  Spin,
  Icon,
  Modal,
  Button,
  TextArea,
  CheckBox,
  Select,
  SelectBox,
  TreeSelect,
} from 'choerodon-ui/pro';
import {
  includes, map, get,
  remove,
} from 'lodash';
import { NewTips } from '@zknow/components';
import { get as getInject } from '@choerodon/inject';
import useExternalFunc from '@/hooks/useExternalFunc';
import { fileServer, prompt } from '@/utils';
import { cbaseApi, projectsApi } from '@/apis';
import axios from '@/components/axios';
import ImageUpload from './components/imageUpload';
import NotifitionModal from './components/notifition-modal';
import openCreateNotification from '@/components/notification';
import { useCreateProjectProStore } from './stores';
import ProjectNotification from './components/project-notification';
import { getCustomFieldDsProps, timeTypeArr, numberTypeArr } from './untils/getCustomFieldDsProps';
import { getDisplayDateTypeValue, getsubmitDateTypeValue, getNumberTypeDynamicProps } from './untils';
import handleGetFormContent, { contrastMapToFormDsMap } from './untils/getFormContent';
import './index.less';

const projectRelationshipCodes = ['N_WATERFALL', 'N_AGILE', 'N_REQUIREMENT'];

const CreateProject = observer(() => {
  const {
    projectId: propsProjectId,
    formDs,
    templateDs,
    categoryDs,
    AppState,
    intl,
    prefixCls,
    modal,
    refresh,
    categoryCodes,
    intl: { formatMessage },
    intlPrefix,
    AppState: {
      currentMenuType: {
        organizationId,
      },
      userInfo: {
        currentRoleLabels,
      },
    },
    projectId: currentProjectId,
    createProjectStore,
    standardDisable,
    isTemplate,
    setSuccess,
    classId,
    tableDs,
    handleGotToProject,
  } = useCreateProjectProStore();
  const [isShowAvatar, setIsShowAvatar] = useState(false);
  const [check, setCheck] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templateTabsKey, setTemplateTabsKey] = useState([]);
  const [hasConfiged, setHasConfiged] = useState(false);
  const [showDevopsAdvanced, setShowDevopsAdvanced] = useState(false);
  const [expandAdvanced, setExpandAdvanced] = useState(true);
  const [fieldsConfig, setFieldsConfig] = useState([]);
  const [checkModal, setCheckModal] = useState();
  const [sagaInstanceIds, setSagaInstanceIds] = useState();
  const [isRetry, setIsRetry] = useState(false);
  const [ycloudFlag, setYcloudFlag] = useState(false);

  const { loading: haitianMasterLoading, func } = useExternalFunc('haitianMaster', 'haitianMaster:createProjectForm');
  const { loading: openTemplateLoading, func: openTemplate } = useExternalFunc('agile', 'agile:openTemplate');

  const record = useMemo(() => formDs.current, [formDs.current]);
  const isModify = !!propsProjectId;

  useEffect(() => {
    modal.update({
      okProps: { loading: isLoading },
      cancelProps: { disabled: isLoading },
    });
  }, [isLoading]);

  useEffect(() => {
    getChecked();
    getYcloudFlag();
  }, []);

  useEffect(() => {
    record && initFormDs();
    if (propsProjectId) {
      const ids = formDs?.current?.get('projectTemplateInfo').projectTemplateClassfication;
       record?.set('templateClassficationId', ids);
    }
  }, [record]);
  const getYcloudFlag = async () => {
    try {
      const res = await projectsApi.getYcloudSpace(organizationId);
      if (res && res.failed !== true) {
        setYcloudFlag(res.linkKnowledgeFlag);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const initFormDs = async () => {
    // 创建项目模板自定义配置字段
    if (isTemplate) {
      const res = [
        {
          builtInFlag: true,
          currentTimeFlag: false,
          decimalFlag: false,
          fieldCode: 'name',
          fieldId: '1',
          fieldName: '名称',
          fieldType: 'input',
          organizationId: organizationId,
          requireFlag: true,
        },
        {
          builtInFlag: true,
          currentTimeFlag: false,
          decimalFlag: false,
          fieldCode: 'templateClassficationId',
          fieldId: '2',
          fieldName: '模板分类',
          fieldType: 'select',
          organizationId: organizationId,
          requireFlag: true,
        },
        {
          builtInFlag: true,
          currentTimeFlag: false,
          decimalFlag: false,
          defaultValueObj: '',
          fieldCode: 'description',
          fieldId: '3',
          fieldName: '描述',
          fieldType: 'text',
          organizationId: organizationId,
          requireFlag: false,
        },
      ];
      if (!propsProjectId && classId) {
        formDs?.current?.set('templateClassficationId', classId);
      }
      res.forEach((item) => {
        if (item.builtInFlag && contrastMapToFormDsMap.get(item.fieldCode)) {
          item.fieldCode = contrastMapToFormDsMap.get(item.fieldCode);
        }

        const {
          fieldCode, fieldType, fieldId, fieldName, requireFlag, defaultValue, value, valueStr, decimalFlag,
        } = item;

        if (!formDs?.getField(fieldCode)) {
          const dsProps = getCustomFieldDsProps({
            fieldConfig: item,
          });

          if (numberTypeArr.includes(fieldType)) {
            dsProps.dynamicProps = getNumberTypeDynamicProps(fieldType, decimalFlag);
          }

          if (dsProps.options && defaultValue && !isModify) {
            dsProps.options.setState('selectids', Array.isArray(defaultValue) ? [...defaultValue] : [defaultValue]);
          }

          if (dsProps.options && value && isModify) {
            dsProps.options.setState('selectids', Array.isArray(value) ? [...value] : [value]);
          }

          formDs?.addField(fieldCode, {
            label: fieldName,
            required: requireFlag,
            ...dsProps,
            ignore: 'always',
          });
          // 给自定义字段一个标记，用于提交数据处理
          formDs.setState(fieldCode, {
            fieldType,
            fieldId,
            fieldCode,
          });
          // 初始化表单值
          if ((defaultValue || defaultValue === 0) && !isModify) {
            if (timeTypeArr.includes(fieldType)) {
              record.set(fieldCode, getDisplayDateTypeValue(defaultValue, fieldType));
            } else {
              record.set(fieldCode, defaultValue);
            }
          }
          if ((value || value === 0) && isModify) {
            record.set(fieldCode, timeTypeArr.includes(fieldType) ? valueStr : value); // valueStr用于时间类型
          }
        } else {
          (defaultValue || defaultValue === 0) && formDs?.current?.set(fieldCode, defaultValue);
        formDs?.getField(fieldCode).set('required', requireFlag);
        }
      });
      setFieldsConfig(res);
    } else {
      const res = await cbaseApi.getFields({
        pageAction: isModify ? 'edit' : 'create',
        projectId: isModify ? propsProjectId : '',
      });
      remove(res, (item) => item.fieldCode === 'type');
      res.forEach((item) => {
        if (item.builtInFlag && contrastMapToFormDsMap.get(item.fieldCode)) {
          item.fieldCode = contrastMapToFormDsMap.get(item.fieldCode);
        }

        const {
          fieldCode, fieldType, fieldId, fieldName, requireFlag, defaultValue, value, valueStr, decimalFlag,
        } = item;

        if (!formDs?.getField(fieldCode)) {
          const dsProps = getCustomFieldDsProps({
            fieldConfig: item,
          });

          if (numberTypeArr.includes(fieldType)) {
            dsProps.dynamicProps = getNumberTypeDynamicProps(fieldType, decimalFlag);
          }

          if (dsProps.options && defaultValue && !isModify) {
            dsProps.options.setState('selectids', Array.isArray(defaultValue) ? [...defaultValue] : [defaultValue]);
          }

          if (dsProps.options && value && isModify) {
            dsProps.options.setState('selectids', Array.isArray(value) ? [...value] : [value]);
          }

          formDs?.addField(fieldCode, {
            label: fieldName,
            required: requireFlag,
            ...dsProps,
            ignore: 'always',
          });
          // 给自定义字段一个标记，用于提交数据处理
          formDs.setState(fieldCode, {
            fieldType,
            fieldId,
            fieldCode,
          });
          // 初始化表单值
          if ((defaultValue || defaultValue === 0) && !isModify) {
            if (timeTypeArr.includes(fieldType)) {
              record.set(fieldCode, getDisplayDateTypeValue(defaultValue, fieldType));
            } else {
              record.set(fieldCode, defaultValue);
            }
          }
          if ((value || value === 0) && isModify) {
            record.set(fieldCode, timeTypeArr.includes(fieldType) ? valueStr : value); // valueStr用于时间类型
          }
        } else {
          (defaultValue || defaultValue === 0) && formDs?.current?.set(fieldCode, defaultValue);
        formDs?.getField(fieldCode).set('required', requireFlag);
        }
      });
      setFieldsConfig(res);
    }
  };

  const getFormContent = useCallback(
    (ds) => handleGetFormContent(fieldsConfig, currentRoleLabels, formDs, isModify),
    [fieldsConfig, currentRoleLabels, isModify],
  );

  useEffect(() => {
    const loadTemplateConfig = async () => {
      let notConfigured = true;
      if (currentProjectId) {
        notConfigured = await axios.get(
          `/agile/v1/organizations/${organizationId}/organization_config/check_configured?projectId=${currentProjectId}`,
        );
        setHasConfiged(!notConfigured);
      }
      if (!currentProjectId || (currentProjectId && notConfigured)) {
        axios
          .get(
            `/agile/v1/organizations/${organizationId}/organization_config/check_config_template`,
          )
          .then((res) => {
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
  // 控制下次创建是否还提示
  const handleChanges = (value) => {
    setCheckModal(value);
    if (value) {
      sessionStorage.setItem('checkFlag', 'check');
    }
  };
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
      if (getChecked() === true) {
        const findRecord = categoryDs.find(
          (eachRecord) => eachRecord.get('code') === categoryCodes.agile,
        );
        categories.push({
          id: findRecord.get('id'),
          code: findRecord.get('code'),
        });
      }
      if (!record?.get('connectKnowledgeSpaceFlag')) {
        const selectFiled = formDs?.getField('openSpaceId');
        selectFiled?.set('required', false);
      }
      if (typeof formDs?.current?.get('statusId') === 'object') {
        formDs?.current?.set('statusId', formDs?.current?.get('statusId')?.id);
        formDs?.current?.set(
          'projectEnable',
          formDs?.current?.get('statusId')?.projectEnable
        );
      } else {
        const statusItem = formDs?.current
          ?.getField('statusId')
          ?.options?.toData()
          ?.find(
            (i) => String(i?.id) === String(formDs?.current?.get('statusId'))
          );
        if (statusItem) {
          formDs?.current?.set('projectEnable', statusItem?.projectEnable);
        }
      }
      record.set('categories', categories);
      // 项目模板字段
      const records = templateDs.filter((item, index) => index === templateDs.length - 1);
      const postData = {
        previousRank: records[0].get('rank'),
      };
        // const temolateRank = await axios.post(`cbase/choerodon/v1/organizations/${organizationId}/project_template/rank`, postData);
      const info = {
        organizationId: organizationId,
        builtIn: propsProjectId ? record?.get('builtIn')?.builtIn : false,
        // rank: temolateRank,
        templateClassficationId: (typeof record.get('templateClassficationId') === 'object' ? record.get('templateClassficationId')?.id : record.get('templateClassficationId')),
        publishStatus: propsProjectId ? record?.get('projectTemplateInfo')?.publishStatus : 'unpublished',
      };
      record.set('projectTemplateInfo', info);
      const flag = await formDs?.current.validate();
      if (flag) {
        //  改成自定义后 后端给的自定义字段 放到数据里面
        const data = formDs.current.toData();
        const customFields = [];
        Object.keys(data).forEach((key) => {
          const customFieldState = formDs.getState(key);
          if (customFieldState) {
            if (timeTypeArr.includes(customFieldState.fieldType)) {
              customFields.push({
                ...formDs.getState(key),
                value: getsubmitDateTypeValue(data[key], customFieldState.fieldType),
              });
              return;
            }
            customFields.push({
              ...formDs.getState(key),
              value: data[key],
            });
          }
        });
        record.set('customFields', customFields);
        // 处理燕千云知识空间字段
        if (propsProjectId) {
          const ids = formDs?.current?.get('openSpaceId');
          typeof ids === 'object' && formDs?.current?.set('openSpaceId', ids?.id);
        }
        const res = await formDs.submit();
        if (res && !res.failed && res.list && res.list.length) {
          refresh();
          if (!propsProjectId) {
            !sessionStorage.getItem('checkFlag') && Modal.open({
              key: Modal.key(),
              title: '项目模板指引',
              children: <NotifitionModal />,
              okCancel: false,
              okText: '关闭',
              style: { width: 600 },
              bodyStyle: { background: '#f5f6fa' },
              className: `${prefixCls}-notifyModal`,
              footer: (okBtn, cancelBtn) => (
                <div className={`${prefixCls}-modal-footer`}>
                  <div className={`${prefixCls}-modal-footer-check`}>
                    <CheckBox value={checkModal} defaultValue={false} onChange={handleChanges}>
                      关闭浏览器前不再提示
                    </CheckBox>
                  </div>
                  {okBtn}
                </div>
              ),
            });
          }
          const projectId = get(res.list[0], 'id');
          if (projectId) {
            openNotification({
              projectId,
              setSuccess,
              operateType: isModify ? 'update' : 'create',
            });
          }
          return true;
        }
        if (res.failed) {
          message.error(res.message);
        }
        setIsLoading(false);
        return false;
      }
      setIsLoading(false);
      return false;
    } catch (e) {
      setIsLoading(false);
      return false;
    }
  });

  const openNotification = useCallback(({ projectId, setSuccesss, operateType }) => {
    const notificationKey = `${organizationId}-${projectId}`;
    const getProgress = async () => {
      try {
        await axios.get(`/cbase/choerodon/v1/organizations/${organizationId}/saga/${projectId}?operateType=${operateType}`).then((res) => {
          if (res.status === 'failed') {
            setSagaInstanceIds(res.sagaInstanceIds);
          }
        });
      } catch (error) {
        console.log(error);
      }
      return axios.get(`/cbase/choerodon/v1/organizations/${organizationId}/saga/${projectId}?operateType=${operateType}`);
    };
    openCreateNotification({
      notificationKey: notificationKey,
      type: 'polling',
      closeDuration: 3000,
      loadProgress: getProgress,
      afterSuccess: refresh,
      textObject: {
        failed: {
          title: propsProjectId ? '项目模板更新失败' : '项目模板创建失败',
          description: (
            <span>
              <span>
                项目模板
                {operateType === 'create' ? '创建' : '修改'}
                失败, 请重试！
              </span>
            </span>),
        },
        success: {
          title: propsProjectId ? '修改项目模板基础信息成功' : '创建项目模板成功',
          description: propsProjectId ? (
            <span>
              项目模板基础信息修改成功
            </span>
          ) : (
            <span>
              创建项目模板成功，点击立即
              <span
                className="c7ncd-project-create-template-gotoDetail"
                style={{
                  color: 'rgb(83, 101, 234)',
                  cursor: 'pointer',
                  padding: '0.02rem',
                }}
                onClick={handleGotoDetail}
                role="none"
              >
                维护模板详细内容。
              </span>
            </span>
          ),
        },
        doing: {
          title: !propsProjectId ? '创建项目模板' : '修改项目模板基础信息',
          description: !propsProjectId ? (
            <span>
              正在创建项目模板，该过程可能会持续几分钟，成功结束后可以继续维护项目模板详细内容
            </span>
          ) : (
            <span>
              正在更新项目模板基础信息，该过程可能会耗时几分钟，请稍后。
            </span>
          ),
        },
      },
    });
  }, []);
  const handleGotoDetail = () => {
    handleGotToProject(AppState.getProjectTemplateRecord);
  };
  const getChecked = () => {
    if (categoryDs.getState('isProgram') && categoryDs.getState('isAgile') && disabled === false) {
      return true;
    }
    return check;
  };

  const sprintCheckboxOnChanges = (value) => {
    setDisabled(true);
    if (value === true) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  };

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

  useEffect(() => {
    const values = ['N_DEVOPS', 'N_OPERATIONS'];
    const flag = categoryDs.selected.some((categoryRecord) => values.includes(categoryRecord.get('code')));
    if (flag) {
      setShowDevopsAdvanced(true);
    } else {
      setShowDevopsAdvanced(false);
    }
  }, [categoryDs.selected, showDevopsAdvanced]);

  const renderAvatar = useCallback(() => (
    <>
      <div className={`${prefixCls}-template-avatar`}>
        <ImageUpload
          formDs={formDs}
          prefixCls={prefixCls}
          AppState={AppState}
          organizationId={organizationId}
        />
      </div>
      <div style={{ margin: '.06rem 0 .2rem 0', textAlign: 'center' }}>
        项目模板封面
      </div>
    </>
  ), [record, isShowAvatar, AppState]);

  const getCategoryClassNames = useCallback(
    (categoryRecord) => classnames({
      [`${prefixCls}-category-container`]: true,
      [`${prefixCls}-category-container-disabled`]: categoryRecord.getState(
        'disabled',
      ),
      [`${prefixCls}-category-container-selected`]: categoryRecord.isSelected,
      // 暂时修改样式
      [`${prefixCls}-category-container-waterfall-templated-selected`]:
          categoryRecord.isSelected
          && categoryRecord.get('code') === 'N_WATERFALL',
      [`${prefixCls}-category-container-agileProgram-selected`]:
          categoryRecord.isSelected
          && categoryRecord.get('code') === 'N_PROGRAM',
    }),
    [],
  );

  const getTooltipContent = useCallback(
    (categoryRecord) => {
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
          if (
            code === categoryCodes.waterfall
            && (categoryDs.getState('isBeforeAgile')
              || categoryDs.getState('isBeforeProgram'))
          ) {
            return '已添加或添加过【敏捷管理】/【敏捷项目群】项目类型，不可添加【瀑布管理】项目类型';
          }
          if (
            code === categoryCodes.program
            && ((categoryDs.getState('isBeforeAgile')
              && !categoryDs.getState('isBeforeProgram'))
              || categoryDs.getState('isBeforeWaterfall'))
          ) {
            return '已添加或添加过【敏捷管理】/ 【瀑布管理】项目类型，不可添加【敏捷项目群】项目类型';
          }
          if (
            code === categoryCodes.agile
            && ((categoryDs.getState('isBeforeProgram') || categoryDs.getState('isBeforeWaterfall')))
          ) {
            return '已添加或添加过【敏捷项目群】/ 【瀑布管理】项目类型，不可添加【敏捷管理】项目类型';
          }
        }
        if (
          [
            categoryCodes.program,
            categoryCodes.waterfall,
            categoryCodes.agile,
          ].indexOf(code) !== -1
        ) {
          return '敏捷管理、敏捷项目群、瀑布管理不能同时选择';
        }
        return '不可同时选择【敏捷管理】与【规模化敏捷项目群】项目类型';
      }
      return '';
    },
    [createProjectStore.getIsSenior, isModify],
  );

  const handleOpenTemplate = useCallback(() => {
    const currentCategoryCodes = map(categoryDs.selected, (selectedRecord) => selectedRecord.get('code'));
    openTemplate?.default({
      selectedCategoryCodes: currentCategoryCodes,
      agileWaterfall: formDs?.current?.get('agileWaterfall'),
    });
  }, [categoryDs.selected, openTemplate]);

  if (!record) {
    return <Spin spinning />;
  }

  const sprintCheckboxOnChange = (value) => {
    formDs?.current?.set('agileWaterfall', value);
  };

  const selectedRecords = categoryDs.selected;
  const selectedCategoryCodes = map(selectedRecords, (selectedRecord) => selectedRecord.get('code'));

  const getProjRelationShowInDevopsAdvanced = () => {
    if (!isModify) {
      return false;
    }
    if (selectedCategoryCodes.some((item) => projectRelationshipCodes.includes(item))) {
      return true;
    }
    return false;
  };

  const getProjRelationShow = () => {
    if (!isModify) {
      return false;
    }
    if (
      !showDevopsAdvanced
      && selectedCategoryCodes.some((item) => projectRelationshipCodes.includes(item))
    ) {
      return true;
    }
    return false;
  };

  const allowLinkForm = (
    <Form record={record} labelLayout="horizontal" labelWidth={300} labelAlign="left">
      <SelectBox name="allowLink" style={{ width: 340, position: 'relative', top: -3 }}>
        <SelectBox.Option value>允许</SelectBox.Option>
        <SelectBox.Option value={false}>禁止</SelectBox.Option>
      </SelectBox>
    </Form>
  );

  return (
    <div className={`${prefixCls}-body`}>
      {renderAvatar()}
      <Form
        columns={100}
        record={record}
        className={`${prefixCls}-form`}
        labelLayout="float"
      >
        {[...getFormContent(formDs)]}
      </Form>
      <div className={`${prefixCls}-category-label`}>项目类型</div>
      <div className={`${prefixCls}-category`}>
        {categoryDs.map((categoryRecord, index) => (
          <div className={getCategoryClassNames(categoryRecord)} style={{ display: categoryRecord.get('code') === 'N_WATERFALL' ? 'inline-block' : 'none' }}>
            <Tooltip
              title={getTooltipContent(categoryRecord)}
              key={categoryRecord.get('code')}
            >
              <div
                className="category-item"
                onClick={() => handleCategoryClick(categoryRecord)}
                role="none"
              >
                <div className="category-item-content">
                  <div
                    className={`category-item-content-icon category-item-content-icon-${categoryRecord.get(
                      'code',
                    )}`}
                  />
                  <span className="category-item-content-name">
                    {categoryRecord.get('name')}
                  </span>
                </div>
              </div>
            </Tooltip>
            {categoryRecord.get('code') === 'N_PROGRAM'
              && categoryRecord.isSelected && (
                <div
                  role="none"
                  className={`${prefixCls}-category-exception`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <CheckBox
                    checked={getChecked()}
                    onChange={sprintCheckboxOnChanges}
                  />
                  <span
                    style={{
                      marginLeft: 4.25,
                      fontSize: 12,
                      position: 'relative',
                      top: -1,
                    }}
                  >
                    启用敏捷管理
                  </span>
                  <NewTips
                    helpText="启用后菜单中将新增任务看板、工作列表、版本列表，适用于项目群下管理故事、缺陷等场景。启用后可以取消。"
                    style={{
                      marginLeft: 3.17,
                      position: 'relative',
                    }}
                  />
                </div>
            )}
            {/* 瀑布类型暂时不要冲刺 */}
            {categoryRecord.get('code') === 'N_WATERFALL'
              && categoryRecord.isSelected && (
                <div
                  role="none"
                  className={`${prefixCls}-category-exception`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ display: 'none' }}
                >
                  <CheckBox
                    checked={record?.get('agileWaterfall')}
                    onChange={sprintCheckboxOnChange}
                  />
                  <span
                    style={{
                      marginLeft: 4.25,
                      fontSize: 12,
                      position: 'relative',
                      top: -1,
                    }}
                  >
                    启用冲刺
                  </span>
                  <NewTips
                    helpText="启用冲刺适用于大瀑布小敏捷场景， 启用后可使用任务看板，故事地图等功能。"
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
        {(!currentProjectId || (currentProjectId && !hasConfiged))
          && selectedCategoryCodes.find((item) => includes([categoryCodes.agile, categoryCodes.waterfall], item))
          && includes(templateTabsKey, 'statusMachineTemplate') && (
            <>
              <div>
                <span className={`${prefixCls}-template-checkbox-text`}>使用组织预置的状态机及看板模板</span>
                <span
                  role="none"
                  onClick={handleOpenTemplate}
                  className={`${prefixCls}-template-btn`}
                >
                  查看模板
                </span>
              </div>
              <SelectBox dataSet={formDs} name="useTemplate">
                <SelectBox.Option value>是</SelectBox.Option>
                <SelectBox.Option value={false}>否</SelectBox.Option>
              </SelectBox>
            </>
        )}
      </div>
      {
        ((ycloudFlag && propsProjectId)) && (
          <div className={`${prefixCls}-projRelation`}>
            <div className={`${prefixCls}-projRelation-divided`} />
            <p style={{ fontWeight: 500, fontSize: 14 }}>高级设置</p>
            {(ycloudFlag && propsProjectId)
            && (
            <CheckBox
              dataSet={formDs}
              name="connectKnowledgeSpaceFlag"
            >
              连接燕千云知识空间，使用此模板时将同时基于此空间创建新的知识空间连接到项目内
            </CheckBox>
            )}
            {
             record?.get('connectKnowledgeSpaceFlag')
             && (
             <div style={{ marginTop: ycloudFlag ? '15px' : '0' }} className={`${prefixCls}-ycloud`}>
               <Form dataSet={formDs} columns={100}>
                 <Select
                   name="openSpaceId"
                   clearButton
                   searchable
                   colSpan={50}
                   style={{ width: 340, position: 'relative', left: -5 }}
                 />
               </Form>
             </div>
             )
            }
          </div>
        )
      }
      {showDevopsAdvanced && (
        <div className={`${prefixCls}-advanced`}>
          <div className={`${prefixCls}-advanced-divided`} />
          <p className={`${prefixCls}-advanced-title`}>
            高级设置
            <Button
              onClick={() => {
                setExpandAdvanced(!expandAdvanced);
              }}
              icon={expandAdvanced ? 'expand_less' : 'expand_more'}
              className="btn-expand"
            />
          </p>
          <div
            style={
              expandAdvanced
                ? { height: 'auto' }
                : { height: 0, overflow: 'hidden' }
            }
          >
            {
              getProjRelationShowInDevopsAdvanced() && allowLinkForm
            }
            <Alert
              message="DevOps组件编码将用于GitLab Group中的URL片段、Harbor Project的名称片段、SonarQube projectKey前缀、
          以及Helm仓库编码。"
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />
            <Form columns={100} record={record}>
              <TextField
                name="devopsComponentCode"
                colSpan={50}
                style={{ width: 340, position: 'relative', left: -5 }}
              />
            </Form>
          </div>
        </div>
      )}
    </div>
  );
});

export default CreateProject;