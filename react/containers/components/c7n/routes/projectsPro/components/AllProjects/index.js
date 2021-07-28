import React, { useCallback, Fragment } from 'react';
import {
  TextField, Button, Pagination, Tooltip, Modal, Icon, Spin,
} from 'choerodon-ui/pro';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import Permission from '@/containers/components/c7n/tools/permission';
import some from 'lodash/some';
import handleClickProject from '@/containers/components/util/gotoProject';
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
    categoryCodes,
    AppState: {
      currentMenuType: {
        organizationId,
      },
    },
  } = useProjectsProStore();

  function refresh() {
    ProjectsProUseStore.axiosGetProjects();
    ProjectsProUseStore.checkCreate(organizationId);
  }

  const handleAddProject = (currentProjectId) => {
    Modal.open({
      key: Modal.key(),
      drawer: true,
      title: currentProjectId ? '项目设置' : '创建项目',
      className: 'c7n-projects-modal-create-project',
      children: <CreateProject
        refresh={refresh}
        projectId={currentProjectId}
        categoryCodes={categoryCodes}
      />,
      okText: currentProjectId ? '保存' : '创建',
      style: {
        width: '3.8rem',
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

  const openDisableModal = useCallback((projectData) => {
    try {
      const {
        categories, name: projectName, id: projectId, programName,
      } = projectData || {};
      const isProgram = some(categories, ['code', categoryCodes.program]);
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
              <div>
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
        } else if (programName) {
          extraMessage = (
            <div>
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
          onOk: () => handleEnable(projectId, 'disable'),
          okProps,
          okText: '我已经知道后果，停用此项目',
          closable: true,
          footer: (okBtn) => okBtn,
        });
      } else {
        Modal.open({
          title: '停用项目',
          children: <ModalContent />,
          onOk: () => handleEnable(projectId, 'disable'),
        });
      }
    } catch (e) {
      return false;
    }
    return false;
  }, []);

  const handleEnable = useCallback(async (projectId, type) => {
    if (await ProjectsProUseStore.handleEnable({ organizationId, projectId, type })) {
      refresh();
      return true;
    }
    return false;
  }, []);

  const checkOperation = useCallback((data) => data && (data.operateType === 'update' || data.projectStatus === 'success'), []);

  const getActionData = useCallback((data) => {
    const {
      projectStatus, editFlag, enabled, id: currentProjectId,
    } = data;
    const editData = ({
      text: '修改',
      action: () => handleAddProject(data.id),
    });
    const disableData = ({
      text: '停用',
      action: () => openDisableModal(data),
    });
    let actionData;
    if (!enabled) {
      actionData = [{
        text: '启用',
        action: () => handleEnable(currentProjectId, 'enable'),
      }];
    }
    switch (projectStatus) {
      case 'success':
        actionData = [editData, disableData];
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
        } else {
          actionData.unshift(editData);
          actionData.push(disableData);
        }
        break;
      default:
        break;
    }
    return editFlag && actionData ? (
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
      <Tooltip title={p.description} placement="right">
        <div
          key={p.id}
          onClick={() => {
            if (p.enabled && checkOperation(p)) {
              handleClickProject(p, history, AppState);
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
                      backgroundImage: p.createUserImageUrl ? `url("${p.createUserImageUrl}")` : 'unset',
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
      </Tooltip>
    )) : <EmptyPage title="暂无项目" describe="该组织下暂无项目" />;
  }, [ProjectsProUseStore.getAllProjects, history]);

  const handleBlurProjects = ({ ...e }) => {
    ProjectsProUseStore.setAllProjectsParams(e.target.value);
    ProjectsProUseStore.setPagination({
      page: 1,
      size: 10,
    });
    ProjectsProUseStore.axiosGetProjects();
  };

  const renderTitle = () => {
    const { organizationId: searchOrgId } = queryString.parse(history.location.search);
    const org = (HeaderStore.getOrgData || []).find((v) => String(v.id) === searchOrgId) || { name: '' };
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
            showSizeChangerLabel={false}
            showTotal={false}
            showPager
            showQuickJumper
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
