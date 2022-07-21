import React, {
  useEffect, useState, useRef,
} from 'react';
import {
  Button,
  Tooltip,
  Modal,
  Icon,
} from 'choerodon-ui/pro';
import { forIn, orderBy, remove } from 'lodash';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { Permission } from '@/components/permission';
import { useProjectsProStore } from '../../stores';
import HeaderStore from '../../../../../../stores/c7n/HeaderStore';
import CreateProject from '../create-project';
import CustomQuerybar from './customQuerybar';
import { organizationsApi } from '@/apis';
import AllProjectTable from './table';
import {
  searchFieldsConfig, filterFieldsConfig, defaultColumnSetConfig,
} from './querybarConfig';
import TableColumnSet from './tableColumnSet';
import {
  MODAL_WIDTH,
} from '@/constants/MODAL';

import './index.less';

const { MIDDLE } = MODAL_WIDTH;

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

  const customQuerybarCRef = useRef();
  const customColumnSetCRef = useRef();

  const [createBtnToolTipHidden, setCreateBtnToolTipHidden] = useState(true);
  const [inNewUserGuideStepOne, setInNewUserGuideStepOne] = useState(false);
  const [tableColumn, setTableColumn] = useState([]);

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
    getTableColumns();
  }, []);

  const getTableColumns = async () => {
    const res = await organizationsApi.getAllProjectsTableColumns();
    if (res?.listLayoutColumnRelVOS) {
      setTableColumn(customColumnSetCRef?.current?.initData(res?.listLayoutColumnRelVOS, defaultColumnSetConfig));
    } else {
      setTableColumn(defaultColumnSetConfig);
    }
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
        width: MIDDLE,
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

  const customQuerybarChange = async (name, value) => {
    if (name === 'updateTime') {
      projectListDataSet.setQueryParameter('lastUpdateDateStart', value ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : null);
      projectListDataSet.setQueryParameter('lastUpdateDateEnd', value ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : null);
    } else if (name === 'createTime') {
      projectListDataSet.setQueryParameter('creationDateStart', value ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : null);
      projectListDataSet.setQueryParameter('creationDateEnd', value ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : null);
    } else if (name === 'reset' && value === 'reset') {
      // eslint-disable-next-line no-shadow
      forIn(projectListDataSet.queryParameter, (value, key) => {
        projectListDataSet.setQueryParameter(key, null);
      });
    } else {
      projectListDataSet.setQueryParameter(name, value);
    }
    projectListDataSet.query();
  };

  const handleEditColumnOk = async (columnsData) => {
    const listLayoutColumnRelVOS = [];
    columnsData.forEach((item, index) => {
      const iObj = {
        columnCode: item.name, display: item.isSelected, sort: index, width: 0,
      };
      listLayoutColumnRelVOS.push(iObj);
    });
    const postObj = {
      applyType: 'projectView',
      listLayoutColumnRelVOS,
    };
    try {
      await organizationsApi.editAllProjectsTableColumns(postObj);
      getTableColumns();
      return true;
    } catch (error) {
      return false;
    }
  };

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
            <TableColumnSet cRef={customColumnSetCRef} tableDs={projectListDataSet} columnsConfig={tableColumn} handleOk={handleEditColumnOk} />
          </div>
        </div>
        <AllProjectTable columnsConfig={tableColumn} />
      </div>
    </div>
  );
});
