import React, { useCallback, Fragment } from 'react';
import { TextField, Button, Pagination, Tooltip, Modal } from 'choerodon-ui/pro';
import { Progress } from 'choerodon-ui';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import Permission from '@/containers/components/c7n/tools/permission';
import { Icon } from 'choerodon-ui';
import { getRandomBackground } from '@/containers/components/c7n/util';
import axios from '@/containers/components/c7n/tools/axios';
import { prompt } from '@/utils';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import { useProjectsProStore } from '../../stores';
import HeaderStore from '../../../../../../stores/c7n/HeaderStore';
import FormView from '../FormView';
import EmptyPage from '../empty-page';

import './index.less';

export default observer(() => {
  const {
    ProjectsProUseStore,
    history,
    dataSet,
    AppState,
    intl,
  } = useProjectsProStore();

  function refresh() {
    const { currentMenuType: { organizationId } } = AppState;
    ProjectsProUseStore.axiosGetProjects();
    ProjectsProUseStore.checkCreate(organizationId);
  }

  const handleClickProject = (data) => {
    ProjectsProUseStore.handleClickProject(data);
  };

  async function handleCreate() {
    const { currentMenuType: { organizationId } } = AppState;
    const { current } = dataSet;
    if (await current.validate() === true) {
      const { category, code, name, imageUrl } = current.toData();
      const data = {
        name,
        code,
        category,
        imageUrl,
      };
      const res = await axios.post(`/iam/choerodon/v1/organizations/${organizationId}/projects`, data);
      if (res.failed) {
        prompt(res.message);
        return false;
      } else {
        prompt('创建成功');
        // HeaderStore.setRecentItem(res);
        refresh();
        return true;
      }
    }
  }

  async function editProject(modal) {
    try {
      if ((await dataSet.submit()) !== false) {
        if (modal) {
          modal.close();
        }
        refresh();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  async function handleOkEdit(editModal) {
    const { enabled, name, category, categories } = dataSet.current.toData();
    if (dataSet.current.status === 'add') {
      return (await handleCreate() === true);
    }
    if (dataSet.current.getPristineValue('enabled') === false || enabled) {
      return (await editProject() === true);
    }
    try {
      const isSubProject = categories.some(c => c.code === 'PROGRAM_PROJECT');
      const okProps = {
        disabled: true,
        color: 'red',
        style: {
          width: '100%', border: '1px solid rgba(27,31,35,.2)', height: 36, marginTop: -26,
        },
      };
      const ModalContent = ({ modal }) => {
        let extraMessage;
        if (category === 'PROGRAM') {
          extraMessage = (
            <Fragment>
              <div className="c7n-projects-enable-tips">
                警告：项目群停用后，ART将自动停止，子项目和项目群的关联也将自动停用，子项目的迭代节奏、迭代规划不再受到ART的统一管理。ART下进行中的PI将直接完成，未完成的PI将会删除，未完成的特性将会移动至待办。子项目进行中的迭代会直接完成，未开始的冲刺将会删除，未完成的问题将会移动至待办。请谨慎操作！
              </div>
              <div style={{ marginTop: 10 }}>
                请输入
                {' '}
                <span style={{ fontWeight: 600 }}>{name}</span>
                {' '}
                来确认停用。
              </div>
              <TextField
                style={{ width: '100%', marginTop: 10 }}
                autoFocus
                onInput={(e) => {
                  modal.update({
                    okProps: {
                      ...okProps,
                      disabled: e.target.value !== name,
                    },
                  });
                }}
              />
            </Fragment>
          );
        } else if (isSubProject) {
          extraMessage = (
            <div className="c7n-projects-enable-tips">
              警告：子项目停用后，与项目群相关的冲刺将发生变动，进行中的冲刺会直接完成，未开始的冲刺将会删除，未完成的问题将会移动至待办。请谨慎操作！
            </div>
          );
        }
        const content = (
          <div style={{ marginTop: -10 }}>
            {category === 'PROGRAM' && (
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
            <span>确定要停用项目“{name}”吗？停用后，您和项目下其他成员将无法进入此项目。</span>
            {extraMessage}
          </div>
        );
        return content;
      };

      if (category === 'PROGRAM') {
        Modal.open({
          title: '停用项目',
          children: <ModalContent />,
          onOk: () => editProject(editModal),
          okProps,
          okText: '我已经知道后果，停用此项目',
          closable: true,
          footer: okBtn => okBtn,
        });
      } else {
        Modal.open({
          title: '停用项目',
          children: <ModalContent />,
          onOk: () => editProject(editModal),
        });
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  function handleRemove() {
    dataSet.removeAll();
  }

  const handleAddProject = () => {
    dataSet.create();
    Modal.open({
      key: Modal.key(),
      drawer: true,
      title: '创建项目',
      className: 'c7n-projects-modal-create-project',
      children: <FormView context={{ dataSet, AppState, intl }} />,
      onOk: handleOkEdit,
      okText: '创建',
      afterClose: handleRemove,
      style: {
        width: '3.8rem',
      },
    });
  };

  const handleEditProject = async (e, currentProjectId) => {
    e.stopPropagation();

    try {
      dataSet.transport.read.url = `/iam/choerodon/v1/projects/${currentProjectId}`;
      await dataSet.query();

      const modal = Modal.open({
        key: Modal.key(),
        drawer: true,
        title: '项目设置',
        children: <FormView context={{ dataSet, AppState, intl }} />,
        onOk: () => handleOkEdit(modal),
        afterClose: handleRemove,
        okText: '保存',
        style: {
          width: '3.8rem',
        },
      });
    } catch (error) {
      return false;
    }
  };

  const renderProjects = useCallback(() => {
    const projects = ProjectsProUseStore.getAllProjects;
    if (ProjectsProUseStore.getProjectLoading) {
      return (
        <div className="allProjects-content-spin">
          <Progress type="loading" />
        </div>
      );
    } else {
      return projects.length > 0 ? projects.map(p => (
        <div
          onClick={() => {
            if (p.enabled) {
              handleClickProject(p);
            }
          }}
          className="allProjects-content-item"
          style={{
            cursor: p.enabled ? 'pointer' : 'not-allowed',
          }}
        >
          <div
            className="allProjects-content-item-icon"
            style={{
              backgroundImage: p.imageUrl ? `url("${p.imageUrl}")` : getRandomBackground(p.id),
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
              <Icon
                type="mode_edit"
                style={{
                  color: 'rgb(86, 111, 225)',
                  fontSize: '20px',
                  margin: '0 10px 0 auto',
                }}
                className="allProjects-content-item-right-top-edit"
                onClick={(e) => handleEditProject(e, p.id)}
              />
              <Icon
                type={p.starFlag ? 'turned_in' : 'turned_in_not'}
                style={{
                  color: p.starFlag ? 'rgb(86, 111, 225)' : 'rgb(196, 195, 225)',
                  fontSize: '20px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  ProjectsProUseStore.handleStarProject(p).then(() => {
                    ProjectsProUseStore.handleChangeStarProjects(p);
                  });
                }}
              />
            </div>
            <div className="allProjects-content-item-right-down">

              {p.editFlag ? (
                <p
                  className="allProjects-content-item-right-down-pro allProjects-content-item-right-down-pro-edit"
                >
                  <Tooltip title={p.name} placement="bottomLeft">
                    <span>{p.name}</span>
                  </Tooltip>
                </p>
              ) : (
                <p className="allProjects-content-item-right-down-pro">
                  <Tooltip title={p.name} placement="bottomLeft">{p.name}</Tooltip>
                </p>
              )}

              <Tooltip
                title={p.categories && p.categories.find(c => c.code !== 'PROGRAM_PROJECT') && p.categories.find(c => c.code !== 'PROGRAM_PROJECT').name}
              >
                <p className="allProjects-content-item-right-down-text1">
                  <span>
                    <Icon type="project_line" />
                  </span>
                  <p>{p.categories && p.categories.find(c => c.code !== 'PROGRAM_PROJECT') && p.categories.find(c => c.code !== 'PROGRAM_PROJECT').name}</p>
                </p>
              </Tooltip>

              {
                p.programName
                && (
                  <Tooltip title={p.programName}>
                    <p className="allProjects-content-item-right-down-text2">
                      <React.Fragment>
                        <span>
                          <Icon type="project_group" />
                        </span>
                        <p>{p.programName}</p>
                      </React.Fragment>
                    </p>
                  </Tooltip>
                )
              }
              <p className="allProjects-content-item-right-down-time">
                <Tooltip title={p.createUserName} placement="top">
                  <span
                    className="allProjects-content-item-right-down-avatar"
                    style={{
                      backgroundImage: `url(${p.createUserImageUrl})`,
                    }}
                  >
                    {!p.createUserImageUrl && p.createUserName && p.createUserName.slice(0, 1)}
                  </span>
                </Tooltip>
                <p>{p.creationDate.split(' ')[0]} 创建</p>
              </p>
            </div>
          </div>
        </div>
      )) : <EmptyPage title="暂无项目" describe="该组织下暂无项目" />;
    }
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
    const org = (HeaderStore.getOrgData || []).find(v => String(v.id) === organizationId) || { name: '' };
    const { getCanCreate } = ProjectsProUseStore;
    return (
      <React.Fragment>
        <p>{org.name}所有项目</p>
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
              >创建项目
              </Button>
            </Tooltip>
          </Permission>
        </div>
      </React.Fragment>
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
