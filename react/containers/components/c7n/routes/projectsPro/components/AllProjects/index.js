import React, { useCallback, Fragment } from 'react';
import {
  TextField, Button, Pagination, Tooltip, Modal, Icon, Spin,
} from 'choerodon-ui/pro';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import Permission from '@/containers/components/c7n/tools/permission';
import SagaDetails from '../../../../tools/saga-details';
import { useProjectsProStore } from '../../stores';
import HeaderStore from '../../../../../../stores/c7n/HeaderStore';
import EmptyPage from '../empty-page';
import CreateProject from '../create-project';
import ProjectCategory from '../project-category';
import Action from '../../../../tools/action';

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

  const handleAddProject = (currentProjectId) => {
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
    const tips = (
      <span>
        正在
        {projectStatus === 'creating' ? '创建项目' : '修改项目类型'}
        ，该过程可能会持续几分钟。待以下事务实例执行成功后，才能进入项目。
        <br />
        若事务执行失败，可点击下方失败的任务模块，并在右侧点击重试来重新执行操作。
        <br />
        若重试后依然失败，请联系管理员进行处理。
      </span>
    );
    const [modalTitle, newTips] = projectStatus === 'failed'
      ? [formatMessage({ id: 'global.saga-instance.detail' })]
      : [formatMessage({ id: `${intlPrefix}.saga.title.${projectStatus}` }), tips];
    Modal.open({
      title: modalTitle,
      key: Modal.key(),
      children: <SagaDetails sagaInstanceId={id} instance tips={newTips} />,
      drawer: true,
      okCancel: false,
      okText: formatMessage({ id: 'close' }),
      onOk: () => (onOk ? onOk() : true),
      style: {
        width: 'calc(100% - 3.5rem)',
      },
    });
  };

  const handleRetry = useCallback(async (projectId, sagaInstanceIds) => {
    if (await ProjectsProUseStore.retryProjectSaga(projectId, sagaInstanceIds)) {
      refresh();
    }
  }, []);

  const handleDelete = useCallback(async (projectId) => {
    if (await ProjectsProUseStore.deleteProject(projectId)) {
      refresh();
    }
  }, []);

  const checkOperation = useCallback((data) => data && (data.operateType === 'update' || data.projectStatus === 'success'), []);

  const getActionData = useCallback((data) => {
    const { projectStatus } = data;
    const { editFlag } = data;
    const editData = ({
      text: '修改',
      action: () => handleAddProject(data.id),
    });
    let actionData;
    switch (projectStatus) {
      case 'success':
        if (editFlag) {
          actionData = [editData];
        }
        break;
      case 'failed':
        actionData = [{
          text: '重试',
          action: () => handleRetry(data.id, data.sagaInstanceIds),
        }];
        if (data.operateType === 'create') {
          actionData.push({
            text: '删除',
            action: () => handleDelete(data.id),
          });
        } else if (editFlag) {
          actionData.unshift(editData);
        }
        break;
      default:
        break;
    }
    return actionData ? (
      <Action
        data={actionData}
        onClick={(e) => e.stopPropagation()}
        className="allProjects-content-item-right-top-edit"
      />
    ) : null;
  }, []);

  const renderProjects = useCallback(() => {
    const projects = ProjectsProUseStore.getAllProjects;
    if (ProjectsProUseStore.getProjectLoading) {
      return (
        <div className="allProjects-content-spin" style={{ width: '100%' }}>
          <Spin spinning />
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
              <span className={`allProjects-content-item-right-top-left-status allProjects-content-item-right-top-left-status-${!p.projectStatus || p.projectStatus === 'success' ? p.enabled : p.projectStatus}`}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {!p.projectStatus || p.projectStatus === 'success' ? (p.enabled ? '启用' : '停用') : (
                  formatMessage({ id: `${intlPrefix}.${p.projectStatus}${p.projectStatus === 'failed' ? `.${p.operateType}` : ''}` })
                )}
              </span>
            </div>
            {getActionData(p)}
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
            </div>
            <ProjectCategory
              data={p.categories}
              className="allProjects-content-item-right-down-text1"
            />
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
                onClick={() => handleAddProject()}
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
