import React, { useCallback, Fragment } from 'react';
import {
  TextField, Button, Pagination, Tooltip, Modal,
} from 'choerodon-ui/pro';
import { Progress, Icon, Spin } from 'choerodon-ui';
import queryString from 'query-string';
import { merge } from 'lodash';
import { observer } from 'mobx-react-lite';
import Permission from '@/containers/components/c7n/tools/permission';
import { getRandomBackground } from '@/containers/components/c7n/util';
import axios from '@/containers/components/c7n/tools/axios';
import { prompt } from '@/utils';
import SagaDetails from '../../../../tools/saga-details';
import { useProjectsProStore } from '../../stores';
import HeaderStore from '../../../../../../stores/c7n/HeaderStore';
import EmptyPage from '../empty-page';
import CreateProject from '../create-project';

import './index.less';

export default observer(() => {
  const {
    ProjectsProUseStore,
    history,
    dataSet,
    AppState,
    intl,
    intl: {
      formatMessage,
    },
    intlPrefix,
  } = useProjectsProStore();

  function refresh() {
    const { currentMenuType: { organizationId } } = AppState;
    ProjectsProUseStore.axiosGetProjects();
    ProjectsProUseStore.checkCreate(organizationId);
  }

  const handleClickProject = (data) => {
    ProjectsProUseStore.handleClickProject(data);
  };

  const handleAddProject = (e, currentProjectId) => {
    if (currentProjectId) {
      e.stopPropagation();
    }
    Modal.open({
      key: Modal.key(),
      drawer: true,
      title: currentProjectId ? '项目设置' : '创建项目',
      className: 'c7n-projects-modal-create-project',
      children: <CreateProject
        refresh={refresh}
        projectId={currentProjectId}
        openSagaDetails={openSagaDetails}
      />,
      okText: currentProjectId ? '保存' : '创建',
      style: {
        width: '3.8rem',
      },
    });
  };

  const openSagaDetails = (id, projectStatus, onOk) => {
    const [modalTitle, tips] = projectStatus === 'failed'
      ? [formatMessage({ id: 'global.saga-instance.detail' })]
      : [formatMessage({ id: `${intlPrefix}.saga.title.${projectStatus}` }), formatMessage({ id: `${intlPrefix}.saga.tips.${projectStatus}` })];
    Modal.open({
      title: modalTitle,
      key: Modal.key(),
      children: <SagaDetails sagaInstanceId={id} instance tips={tips} />,
      drawer: true,
      okCancel: false,
      okText: formatMessage({ id: 'close' }),
      onOk: () => (onOk ? onOk() : true),
      style: {
        width: 'calc(100% - 3.5rem)',
      },
    });
  };

  const checkOperation = useCallback((data) => data && (!data.sagaInstanceId || data.operatorTYpe === 'update'));

  const renderProjects = useCallback(() => {
    const projects = ProjectsProUseStore.getAllProjects;
    if (ProjectsProUseStore.getProjectLoading) {
      return (
        <div className="allProjects-content-spin" style={{ width: '670px' }}>
          <Spin />
        </div>
      );
    }
    return projects.length > 0 ? projects.map((p) => (
      <div
        key={p.id}
        onClick={() => {
          if (p.enabled && checkOperation(p)) {
            handleClickProject(p);
          }
        }}
        className="allProjects-content-item"
        style={{
          cursor: p.enabled ? 'pointer' : 'not-allowed',
        }}
        role="none"
      >
        <div
          className="allProjects-content-item-icon"
          style={{
            backgroundImage: p.imageUrl ? `url("${p.imageUrl}")` : p.background,
          }}
        >
          <span>
            {!p.imageUrl && p.name && p.name.slice(0, 1).toUpperCase()}
          </span>
        </div>

        <div className="allProjects-content-item-right">
          <div className="allProjects-content-item-right-top">
            <div className="allProjects-content-item-right-top-left">
              <span className="allProjects-content-item-right-top-left-code">{p.code && p.code.toUpperCase()}</span>
              <span className={`allProjects-content-item-right-top-left-status allProjects-content-item-right-top-left-status-${p.enabled}`}>
                {p.enabled ? '启用' : '停用'}
              </span>
            </div>
            {p.editFlag && (!p.sagaInstanceId || (p.projectStatus === 'failed' && p.operatorTYpe === 'update')) ? (
              <Icon
                type="mode_edit"
                style={{
                  color: 'rgb(86, 111, 225)',
                  fontSize: '20px',
                  margin: '0 10px 0 auto',
                }}
                className="allProjects-content-item-right-top-edit"
                onClick={(e) => handleAddProject(e, p.id)}
              />
            ) : null}
            {checkOperation(p) ? (
              <Icon
                type={p.starFlag ? 'stars' : 'star_border'}
                style={{
                  color: p.starFlag ? '#faad14' : 'rgba(15, 19, 88, 0.45)',
                  fontSize: '20px',
                }}
                onClick={(e) => {
                  if (p.enabled) {
                    e.stopPropagation();
                    ProjectsProUseStore.handleStarProject(p).then(() => {
                      ProjectsProUseStore.handleChangeStarProjects(p);
                    });
                  }
                }}
              />
            ) : null}
          </div>
          <div className="allProjects-content-item-right-down">
            <div className="allProjects-content-item-right-down-pro">
              <p>
                <Tooltip title={p.name} placement="bottomLeft">{p.name}</Tooltip>
              </p>
              {
                p.sagaInstanceId && p.projectStatus ? (
                  <Icon
                    className="allProjects-content-item-right-down-pro-dashBoard"
                    style={{ color: p.projectStatus === 'failed' ? 'rgb(247, 103, 118)' : '#3f51b5' }}
                    type="developer_board"
                    onClick={(e) => {
                      e.stopPropagation();
                      openSagaDetails(p.sagaInstanceId, p.projectStatus);
                    }}
                  />
                ) : ''
              }
            </div>
            <Tooltip
              title={p.categories && p.categories.find((c) => c.code !== 'PROGRAM_PROJECT') && p.categories.find((c) => c.code !== 'PROGRAM_PROJECT').name}
            >
              <p className="allProjects-content-item-right-down-text1">
                <span>
                  <Icon type="project_line" />
                </span>
                <p>{p.categories && p.categories.find((c) => c.code !== 'PROGRAM_PROJECT') && p.categories.find((c) => c.code !== 'PROGRAM_PROJECT').name}</p>
              </p>
            </Tooltip>

            {
              p.programName
              && (
                <Tooltip title={p.programName}>
                  <p className="allProjects-content-item-right-down-text2">
                    <>
                      <span>
                        <Icon type="project_group" />
                      </span>
                      <p>{p.programName}</p>
                    </>
                  </p>
                </Tooltip>
              )
            }
            <p className="allProjects-content-item-right-down-time">
              <Tooltip title={p.createUserName} placement="top">
                <span
                  className="allProjects-content-item-right-down-avatar"
                  style={{
                    backgroundImage: p.createUserImageUrl ? `url(${p.createUserImageUrl})` : 'unset',
                  }}
                >
                  {!p.createUserImageUrl && p.createUserName && p.createUserName.slice(0, 1)}
                </span>
              </Tooltip>
              <p>
                {p.creationDate.split(' ')[0]}
                {' '}
                创建
              </p>
            </p>
          </div>
        </div>
      </div>
    )) : <EmptyPage title="暂无项目" describe="该组织下暂无项目" />;
  }, [ProjectsProUseStore.getAllProjects]);

  const handleBlurProjects = ({ ...e }) => {
    ProjectsProUseStore.setAllProjectsParams(e.target.value);
    ProjectsProUseStore.setPagination({
      page: 1,
      size: 10,
    });
    ProjectsProUseStore.axiosGetProjects();
  };

  const renderTitle = () => {
    const { organizationId } = queryString.parse(history.location.search);
    const org = (HeaderStore.getOrgData || []).find((v) => String(v.id) === organizationId) || { name: '' };
    const { getCanCreate } = ProjectsProUseStore;
    return (
      <>
        <p>
          {org.name}
          所有项目
        </p>
        <div className="allProjects-title-right">
          <TextField
            onBlur={handleBlurProjects}
            placeholder="请输入搜索条件"
            className="allProjects-title-right-textField"
            prefix={<Icon style={{ color: 'rgba(202,202,228,1)' }} type="search" />}
          />
          <Permission service={['choerodon.code.organization.project.ps.create']}>
            <Tooltip
              title={getCanCreate ? '' : '项目数量已达上限，无法创建更多项目'}
              placement="bottom"
            >
              <Button
                funcType="raised"
                color="primary"
                disabled={!getCanCreate}
                onClick={handleAddProject}
                style={{
                  height: 30,
                }}
              >
                创建项目
              </Button>
            </Tooltip>
          </Permission>
        </div>
      </>
    );
  };

  const handleChangePagination = (page, pageSize) => {
    ProjectsProUseStore.setPagination({
      page,
      size: pageSize,
    });
    ProjectsProUseStore.axiosGetProjects();
  };

  return (
    <div className="allProjects">
      <div className="allProjects-title">
        {renderTitle()}
      </div>
      <div className="allProjects-content">
        {renderProjects()}
        {ProjectsProUseStore.getAllProjects.length > 0 && (
          <Pagination
            showSizeChanger
            showTotal
            onChange={handleChangePagination}
            page={ProjectsProUseStore.getPagination.page}
            total={ProjectsProUseStore.getPagination.total}
            pageSize={ProjectsProUseStore.getPagination.size}
            style={{
              textAlign: 'right',
              marginTop: 15,
            }}
          />
        )}
      </div>
    </div>
  );
});
