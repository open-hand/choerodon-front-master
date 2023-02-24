import React, {
  useEffect, useState, useRef, useMemo,
} from 'react';
import {
  Button,
  Tooltip,
  Modal,
} from 'choerodon-ui/pro';
import { forIn, isNil } from 'lodash';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useDebounceFn } from 'ahooks';
import { Permission } from '@/components/permission';
import { useProjectsProStore } from '../../stores';
import HeaderStore from '../../../../../../stores/c7n/HeaderStore';
import CreateProject from '../create-project';
import CustomQuerybar from './customQuerybar';
import { organizationsApi } from '@/apis';
import useExternalFunc from '@/hooks/useExternalFunc';
import AllProjectTable from './table';
import {
  getSearchFieldsConfig, getFilterFieldsConfig,
} from './config/querybarConfig';
import { defaultColumnSetConfig, defaultBusinessColumnSetConfig } from './config/tableColumnsSetConfig';
import TableColumnSet, { initColumnSetData } from './tableColumnSet';
import './index.less';

// 是否存在base的商业版本
const HAS_BASE_BUSINESS = C7NHasModule('@choerodon/base-business');
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

  const { loading, func } = useExternalFunc('haitianMaster', 'haitianMaster:createProjectExtraFields');

  const customQuerybarCRef = useRef();

  const [createBtnToolTipHidden, setCreateBtnToolTipHidden] = useState(true);
  const [inNewUserGuideStepOne, setInNewUserGuideStepOne] = useState(false);
  const [tableColumnsSet, setTableColumnsSet] = useState([]);

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

  useEffect(() => {
    initTableColumnsSet();
  }, [func, projectListDataSet]);

  const initTableColumnsSet = async () => {
    const res = await organizationsApi.getAllProjectsTableColumns();
    let extraColumns = [];
    let columnBusinessSetConfig = defaultBusinessColumnSetConfig;
    let columnConfig = defaultColumnSetConfig;
    if (func) {
      extraColumns = func.default();
      columnBusinessSetConfig = [
        ...defaultBusinessColumnSetConfig, {
          ...extraColumns[0], isSelected: true, order: 4.1, width: 140,
        }];
      columnConfig = [
        ...defaultColumnSetConfig, {
          ...extraColumns[0], isSelected: true, order: 4.1, width: 140,
        }];
    }
    setTableColumnsSet(initColumnSetData(res?.listLayoutColumnRelVOS, HAS_BASE_BUSINESS ? columnBusinessSetConfig : columnConfig, projectListDataSet));
  };

  const refresh = (projectId) => {
    ProjectsProUseStore.checkCreate(organizationId);
    customQuerybarCRef?.current?.reset();
    if (projectId) {
      MenuStore.menuGroup.project = {};
    }
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
          {formatProject({ id: 'allProject' }, { name: org.name })}
        </p>
        <div className="allProjects-title-right">
          <Button icon="refresh" onClick={() => { refresh('0'); }} />
          <Permission
            service={['choerodon.code.organization.project.ps.create']}
          >
            <Tooltip
              popupClassName={
                inNewUserGuideStepOne ? 'c7n-pro-popup-projects-create-guide' : ''
              }
              hidden={createBtnToolTipHidden}
              onHiddenBeforeChange={onHiddenBeforeChange}
              title={getCreatBtnTitle}
              placement={inNewUserGuideStepOne ? 'bottomRight' : 'bottom'}
            >
              <Button
                funcType="raised"
                color="primary"
                disabled={!getCanCreate}
                onClick={() => handleAddProject()}
                style={{
                  height: 30,
                  marginLeft: 16,
                }}
              >
                {formatProject({ id: 'createProject' })}
              </Button>
            </Tooltip>
          </Permission>
        </div>
      </>
    );
  };

  const handleAddProject = (currentProjectId) => {
    setCreateBtnToolTipHidden(true);
    Modal.open({
      key: Modal.key(),
      drawer: true,
      title: currentProjectId ? '项目设置' : '创建项目',
      className: 'c7n-projects-modal-create-project',
      children: (
        <CreateProject
          refresh={refresh}
          projectId={currentProjectId}
          categoryCodes={categoryCodes}
          inNewUserGuideStepOne={inNewUserGuideStepOne}
        />
      ),
      okText: currentProjectId ? '保存' : '创建',
      style: {
        width: 744,
      },
    });
  };

  const toHelpDoc = () => {
    window.open(
      `${AppState?.getUserWizardStatus[0]?.helpDocs[0]}`,
      '_blank',
    );
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

  const customQuerybarChange = async (data) => {
    forIn(projectListDataSet.queryParameter, (value, key) => {
      projectListDataSet.setQueryParameter(key, null);
    });

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (isNil(value) || (Array.isArray(value) && !value.length)) {
        return;
      }
      if (key === 'updateTime') {
        projectListDataSet.setQueryParameter('lastUpdateDateStart', value ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : null);
        projectListDataSet.setQueryParameter('lastUpdateDateEnd', value ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : null);
      } else if (key === 'createTime') {
        projectListDataSet.setQueryParameter('creationDateStart', value ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : null);
        projectListDataSet.setQueryParameter('creationDateEnd', value ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : null);
      } else {
        projectListDataSet.setQueryParameter(key, value);
      }
    });
    projectListDataSet.query();
  };

  function transformColumnData(columnsData) {
    const listLayoutColumnRelVOS = [];
    columnsData.forEach((item, index) => {
      const iObj = {
        columnCode: item.name, display: item.isSelected, sort: index, width: item.width || 0,
      };
      listLayoutColumnRelVOS.push(iObj);
    });
    const postObj = {
      applyType: 'projectView',
      listLayoutColumnRelVOS,
    };
    return postObj;
  }

  const handleEditColumnOk = async (columnsData) => {
    const postObj = transformColumnData(columnsData);
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
    const postObj = transformColumnData(columnsData);
    try {
      organizationsApi.editAllProjectsTableColumns(postObj);
      return true;
    } catch (error) {
      return false;
    }
  };

  const { run } = useDebounceFn(handleColumnResize, { wait: 500 });

  const searchFieldsConfig = useMemo(() => getSearchFieldsConfig(organizationId, HAS_BASE_BUSINESS), [organizationId]);
  const filterFieldsConfig = useMemo(() => getFilterFieldsConfig(organizationId), [organizationId]);

  console.log('tableColumnsSet', tableColumnsSet);

  return (
    <div className="allProjects">
      <div className="allProjects-title">{renderTitle()}</div>
      <div className="allProjects-content">
        <div className="allProjects-table-header">
          <CustomQuerybar
            searchFieldsConfig={searchFieldsConfig}
            filterFieldsConfig={filterFieldsConfig}
            onChange={customQuerybarChange}
            cRef={customQuerybarCRef}
          />
          <div className="tableColumnSet-content">
            <TableColumnSet columnsSetConfig={tableColumnsSet} handleOk={handleEditColumnOk} />
          </div>
        </div>
        <AllProjectTable columnsSetConfig={tableColumnsSet} onColumnResize={run} fieldFunc={func} />
      </div>
    </div>
  );
});
