import React, {useState, useCallback} from 'react';
import {TextField, Button, Pagination, Tooltip, Modal} from "choerodon-ui/pro";
import queryString from 'query-string';
import HeaderStore from '../../../../../../stores/c7n/HeaderStore';
import MenuStore from '../../../../../../stores/c7n/MenuStore';
import { observer } from 'mobx-react-lite';
import Permission from "@/containers/components/c7n/tools/permission";
import { useProjectsProStore } from "../../stores";
import { Icon } from "choerodon-ui";
import axios from '@/containers/components/c7n/tools/axios'

import './index.less';
import findFirstLeafMenu from "@/containers/components/util/findFirstLeafMenu";
import {historyPushMenu, prompt} from "@/utils";
import FormView from "../FormView";

export default observer(() => {
  const {
    ProjectsProUseStore,
    history,
    dataSet,
    AppState,
    intl,
  } = useProjectsProStore();

  const handleClickProject = (data) => {
    ProjectsProUseStore.handleClickProject(data);
  }

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
        HeaderStore.setRecentItem(res);
        ProjectsProUseStore.axiosGetProjects();
        ProjectsProUseStore.checkCreate(organizationId);
        return true;
      }
    }
  }

  async function handleOkEdit() {
    return (await handleCreate() === true);
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
      // onCancel: handleCancelCreate,
      // afterClose: handleRomove,
      style: {
        width: '3.8rem',
      },
    });
  }

  const renderProjects = useCallback(() => {
    const projects = ProjectsProUseStore.getAllProjects;
    return projects.map(p => {
      return (
        <div onClick={() => handleClickProject(p)} className="allProjects-content-item">
          <div
            className="allProjects-content-item-icon"
            style={{
              backgroundImage: p.imageUrl ? `url("${p.imageUrl}")` : p.background,
            }}
          >
            {p.name.slice(0, 1)}
          </div>
          <div className="allProjects-content-item-right">
            <div className="allProjects-content-item-right-top">
              <div className="allProjects-content-item-right-top-left">
                <span className="allProjects-content-item-right-top-left-code">{p.code && p.code.toUpperCase()}</span>
                <span className="allProjects-content-item-right-top-left-status">{p.enabled ? '启用' : '未启用'}</span>
              </div>
              <Icon
                type={p.starFlag ? 'turned_in' : 'turned_in_not'}
                style={{
                  color: p.starFlag ? 'rgb(86, 111, 225)' : 'rgb(196, 195, 225)',
                  fontSize: '20px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  ProjectsProUseStore.handleStarProject(p).then(() => {
                    ProjectsProUseStore.handleChangeStarProjects(p)
                  });
                }}
              />
            </div>
            <div className="allProjects-content-item-right-down">
              <p className="allProjects-content-item-right-down-pro">{p.name}</p>
              <p className="allProjects-content-item-right-down-text1">
              <span>
                <Icon type="project_line" />
              </span>
                <p>{p.categories && p.categories.find(c => c.code !== 'PROGRAM_PROJECT') && p.categories.find(c => c.code !== 'PROGRAM_PROJECT').name}</p>
              </p>
              <p className="allProjects-content-item-right-down-text2">

                {p.categories && p.categories.find(c => c.code === 'PROGRAM_PROJECT') && (
                    <React.Fragment>
                    <span>
                      <Icon type="project_group" />
                    </span>
                      <p>{p.categories.find(c => c.code === 'PROGRAM_PROJECT').name}</p>
                    </React.Fragment>
                  )
                }
              </p>
              <p className="allProjects-content-item-right-down-time">
                <span
                  style={{
                    backgroundImage: `url(${p.createUserImageUrl})`,
                  }}
                />
                <p>{p.creationDate.split(' ')[0]} 创建</p>
              </p>
            </div>
          </div>
        </div>
      )
    })
  }, [ProjectsProUseStore.getAllProjects]);

  const handleBlurProjects = ({...e}) => {
    ProjectsProUseStore.setAllProjectsParams(e.target.value);
    ProjectsProUseStore.setPagination({
      page: 1,
      size: 10,
    });
    ProjectsProUseStore.axiosGetProjects();
  }

  const renderTitle = () => {
    const { organizationId } = queryString.parse(history.location.search);
    const org = (HeaderStore.getOrgData || []).find(v => String(v.id) === organizationId) || { name: '' };
    const getCanCreate = ProjectsProUseStore.getCanCreate;
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
              >创建项目</Button>
            </Tooltip>
          </Permission>
        </div>
      </React.Fragment>
    )
  }

  const handleChangePagination = (page, pageSize) => {
    ProjectsProUseStore.setPagination({
      page,
      size: pageSize,
    });
    ProjectsProUseStore.axiosGetProjects();
  }

  return (
    <div className="allProjects">
      <div className="allProjects-title">
        {renderTitle()}
      </div>
      <div className="allProjects-content">
        {renderProjects()}
        <Pagination
          showSizeChanger
          showTotal
          onChange={handleChangePagination}
          page={ProjectsProUseStore.getPagination.page}
          total={ProjectsProUseStore.getPagination.total}
          style={{
            textAlign: 'right',
            marginTop: 15,
          }}
        />
      </div>
    </div>
  )
});
