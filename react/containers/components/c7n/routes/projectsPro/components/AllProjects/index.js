import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  Button, Tooltip, Modal, Spin,
} from 'choerodon-ui/pro';
import { isNil } from 'lodash';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useDebounceFn } from 'ahooks';
import { Permission } from '@/components/permission';
import { useProjectsProStore } from '../../stores';
import HeaderStore from '../../../../../../stores/c7n/HeaderStore';
import CreateProject from '../create-project';
// import CreateProject from '../create-project-template';
import CustomQuerybar, { getCacheData } from './components/customQuerybar';
import { organizationsApi, cbaseApi } from '@/apis';
import useExternalFunc from '@/hooks/useExternalFunc';
import ButtonGroup from '@/components/btn-group';
import addAction from '@/utils/addAction';
import AllProjectTable from './table';

import {
  getSearchFieldsConfig,
  getFilterFieldsConfig,
} from './config/querybarConfig';

import {
  defaultColumnSetConfig,
  defaultBusinessColumnSetConfig,
} from './config/tableColumnsSetConfig';
import TableColumnSet, { initColumnSetData } from './components/tableColumnSet';
import { timeTypeArr } from '../create-project/untils/getCustomFieldDsProps';
import {
  transformColumnDataToSubmit,
  transformToSearchFieldsConfig,
  transformToFilterFieldsConfig,
  getQueryObj,
} from './untils';
import './index.less';

// 是否存在base的商业版本
const HAS_BASE_BUSINESS = C7NHasModule('@choerodon/base-business');
const cacheKey = 'projects.list.selected';

export default observer(() => {
  const {
    ProjectsProUseStore,
    history,
    AppState,
    intl: { formatMessage },
    intlPrefix,
    categoryCodes,
    AppState: {
      currentMenuType: { organizationId },
    },
    MenuStore,
    formatProject,
    formatCommon,
    projectListDataSet,
  } = useProjectsProStore();

  const { loading: haitianFuncLoading, func } = useExternalFunc(
    'haitianMaster',
    'haitianMaster:createProjectExtraFields',
  );

  const { loading: baseBusinessFuncLoading, func: openCreateProjectByTemplateModal } = useExternalFunc(
    'baseBusiness',
    'base-business:openCreateProjectByTemplateModal',
  );

  const [createBtnToolTipHidden, setCreateBtnToolTipHidden] = useState(true);
  const [inNewUserGuideStepOne, setInNewUserGuideStepOne] = useState(false);
  const [pageLoading, setPageloading] = useState(true);
  const [tableColumnsSet, setTableColumnsSet] = useState([]);
  const [customFields, setCustomFields] = useState(undefined);

  useEffect(() => {
    if (
      AppState.getUserWizardStatus
      && AppState.getUserWizardStatus[0].status === 'uncompleted'
    ) {
      setInNewUserGuideStepOne(true);
      setCreateBtnToolTipHidden(false);
    } else {
      setInNewUserGuideStepOne(false);
      setCreateBtnToolTipHidden(true);
    }
  }, [AppState.getUserWizardStatus]);

  // 获取系统自定义字段
  useEffect(() => {
    async function asyncFunc() {
      // 获取系统预定义字段  并且给 projectListDataSet 加上field
      const res = await cbaseApi.getFields({
        pageAction: '',
        buildInFlag: false,
      });
      setCustomFields(res || []);
      res.forEach((item) => {
        if (!projectListDataSet.getField(item.code)) {
          projectListDataSet.addField(item.fieldCode, {
            label: item.fieldName,
            bind: `customFieldValue.${item.fieldCode}`,
          });
        }
      });
    }
    asyncFunc();
  }, []);

  useEffect(() => {
    if (!haitianFuncLoading && customFields) {
      initTableColumnsSet();
      setPageloading(false);
      projectListDataSet.setState('queryData', getQueryObj(getCacheData(cacheKey), customFields));
      projectListDataSet.query(1);
    }
  }, [haitianFuncLoading, func, projectListDataSet, customFields]);

  const initTableColumnsSet = async () => {
    const res = await organizationsApi.getAllProjectsTableColumns();
    let extraColumns = [];
    let columnBusinessSetConfig = defaultBusinessColumnSetConfig;
    let columnConfig = defaultColumnSetConfig;
    if (func) {
      extraColumns = func.default();
      columnBusinessSetConfig = [
        ...defaultBusinessColumnSetConfig,
        {
          ...extraColumns[0],
          isSelected: true,
          order: 4.1,
          width: 140,
        },
      ];
      columnConfig = [
        ...defaultColumnSetConfig,
        {
          ...extraColumns[0],
          isSelected: true,
          order: 4.1,
          width: 140,
        },
      ];
    }
    setTableColumnsSet(
      initColumnSetData(
        res?.listLayoutColumnRelVOS,
        HAS_BASE_BUSINESS ? columnBusinessSetConfig : columnConfig,
        customFields,
        projectListDataSet,
      ),
    );
  };

  const getDateFieldsArr = useMemo(() => {
    const arr = ['createTime', 'updateTime'];
    customFields?.forEach((item) => {
      if (timeTypeArr.includes(item.fieldType)) {
        arr.push(item.fieldCode);
      }
    });
    return arr;
  }, [customFields]);

  const refresh = (projectId) => {
    ProjectsProUseStore.checkCreate(organizationId);
    projectListDataSet.query(1);
    if (projectId) {
      MenuStore.menuGroup.project = {};
    }
  };

  const handleAddProjectByTemplate = () => {
    addAction('点击了基于模板创建');
    openCreateProjectByTemplateModal?.default && openCreateProjectByTemplateModal.default({
      onClickUse: handleAddProject,
    });
  };

  const renderTitle = () => {
    const { organizationId: searchOrgId } = queryString.parse(
      history.location.search,
    );
    const org = (HeaderStore.getOrgData || []).find(
      (v) => String(v.id) === searchOrgId,
    ) || { name: '' };
    const { getCanCreate } = ProjectsProUseStore;
    return (
      <>
        <p>
          {formatMessage(
            { id: 'c7ncd.project.allProject' },
            { name: org.name },
          )}
        </p>
        <div className="allProjects-title-right">
          <Button
            icon="refresh"
            onClick={() => {
              refresh('0');
            }}
          />
          <Permission
            service={['choerodon.code.organization.project.ps.create']}
          >
            <Tooltip
              popupClassName={
                inNewUserGuideStepOne
                  ? 'c7n-pro-popup-projects-create-guide'
                  : ''
              }
              hidden={createBtnToolTipHidden}
              onHiddenBeforeChange={onHiddenBeforeChange}
              title={getCreatBtnTitle}
              placement={inNewUserGuideStepOne ? 'bottomRight' : 'bottom'}
            >
              <ButtonGroup
                trigger="hover"
                color="primary"
                style={{ height: 30, marginLeft: 16 }}
                btnItems={[{
                  name: '创建空白项目',
                  permissions: ['choerodon.code.organization.project.ps.create'],
                  handler: () => handleAddProject(),
                }, {
                  name: '基于模板创建',
                  permissions: ['choerodon.code.organization.project.ps.create'],
                  handler: handleAddProjectByTemplate,
                }]}
                name={formatMessage({ id: 'c7ncd.project.createProject' })}
                disabled={!getCanCreate}
                onClick={() => handleAddProject()}
              />
            </Tooltip>
          </Permission>
        </div>
      </>
    );
  };

  const handleAddProject = (currentProjectId, templateData) => {
    setCreateBtnToolTipHidden(true);
    Modal.open({
      key: Modal.key(),
      drawer: true,
      // eslint-disable-next-line no-nested-ternary
      title: templateData ? (
        <div className="c7n-projects-modal-template-title">
          <span>基于模板创建项目</span>
          <div className="c7n-projects-modal-template-title-tag">
            <span>{templateData?.name}</span>
          </div>
        </div>
      ) : (currentProjectId ? '项目设置' : '创建项目'),
      className: 'c7n-projects-modal-create-project',
      children: (
        <CreateProject
          refresh={refresh}
          projectId={currentProjectId}
          categoryCodes={categoryCodes}
          inNewUserGuideStepOne={inNewUserGuideStepOne}
          templateData={templateData}
        />
      ),
      okText: currentProjectId ? '保存' : '创建',
      style: {
        width: 744,
      },
    });
  };

  const toHelpDoc = () => {
    window.open(`${AppState?.getUserWizardStatus[0]?.helpDocs[0]}`, '_blank');
  };

  const getCreatBtnTitle = () => {
    if (inNewUserGuideStepOne) {
      return (
        <div style={{ background: '#6E80F1 !important' }}>
          <div style={{ padding: 8 }}>
            项目主要用来管理项目团队，设置不同的项目类型，邀请团队成员加入一起开展工作，团队成员在项目中可以进行迭代规划、应用开发、应用部署、敏捷化测试等，共同达成项目目标。
          </div>
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                setCreateBtnToolTipHidden(true);
              }}
              style={{ color: '#fff', background: '#7E90F1' }}
            >
              {formatCommon({ id: 'neglect' })}
            </Button>
            <Button
              onClick={toHelpDoc}
              style={{ color: 'var(--primary-color)', background: '#fff' }}
            >
              {formatCommon({ id: 'check' })}
            </Button>
          </div>
        </div>
      );
    }
    const { getCanCreate } = ProjectsProUseStore;
    return getCanCreate ? '' : '项目数量已达上限，无法创建更多项目';
  };

  const onHiddenBeforeChange = (hidden) => {
    const { getCanCreate } = ProjectsProUseStore;
    if (!getCanCreate) {
      setCreateBtnToolTipHidden(hidden);
    }
    if (inNewUserGuideStepOne && createBtnToolTipHidden === true && !hidden) {
      setCreateBtnToolTipHidden(hidden);
    }
  };

  const customQuerybarChange = useCallback(
    (data) => {
      if (!customFields) {
        return;
      }
      projectListDataSet.setState('queryData', getQueryObj(data, customFields));
      projectListDataSet.query(1);
    },
    [projectListDataSet, customFields],
  );

  const handleEditColumnOk = async (columnsData) => {
    const postObj = transformColumnDataToSubmit(columnsData);
    try {
      await organizationsApi.editAllProjectsTableColumns(postObj);
      initTableColumnsSet();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleColumnResize = ({ column, width, index }) => {
    const columnsData = [...tableColumnsSet];
    const found = columnsData.find((item) => item.name === column.name);
    found.width = width;
    const postObj = transformColumnDataToSubmit(columnsData);
    try {
      organizationsApi.editAllProjectsTableColumns(postObj);
      return true;
    } catch (error) {
      return false;
    }
  };

  const { run } = useDebounceFn(handleColumnResize, { wait: 500 });

  const searchFieldsConfig = useMemo(
    () => transformToSearchFieldsConfig(
      getSearchFieldsConfig({
        orgId: organizationId,
        hasBusiness: HAS_BASE_BUSINESS,
      }),
      customFields || [],
    ),
    [organizationId, customFields],
  );

  const filterFieldsConfig = useMemo(() => getFilterFieldsConfig(), []);

  const customfilterFieldsConfig = useMemo(
    () => transformToFilterFieldsConfig(customFields || []),
    [customFields],
  );

  return (
    <div className="allProjects">
      <div className="allProjects-title">{renderTitle()}</div>
      <div className="allProjects-content">
        {
          pageLoading ? <Spin /> : (
            <>
              <div className="allProjects-table-header">
                <CustomQuerybar
                  searchFieldsConfig={searchFieldsConfig}
                  filterFieldsConfig={filterFieldsConfig}
                  customfilterFieldsConfig={customfilterFieldsConfig}
                  dateFieldsArr={getDateFieldsArr}
                  cacheKey={cacheKey}
                  onChange={customQuerybarChange}
                />
                <div className="tableColumnSet-content">
                  <TableColumnSet
                    columnsSetConfig={tableColumnsSet}
                    handleOk={handleEditColumnOk}
                    alawaysDisplayCodes={['name']}
                  />
                </div>
              </div>
              <AllProjectTable
                columnsSetConfig={tableColumnsSet}
                onColumnResize={run}
                fieldFunc={func}
              />
            </>
          )
        }
      </div>
    </div>
  );
});
