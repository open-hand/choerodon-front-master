import Api from '../../Api';

class DevopsProjectApi extends Api<DevopsProjectApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/devops/v1/project';
  }

  //  项目层流水线模板
  getProjectPinelineTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_pipeline`,
      method: 'get',
      params,
    });
  }

  getProjectPinelineTemplateById(id:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_pipeline/${id}`,
      method: 'get',
    });
  }

  createProjectPinelineTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_pipeline`,
      method: 'post',
      data: {
        ...data,
        sourceId: this.projectId,
      },
    });
  }

  modifyProjectPinelineTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_pipeline`,
      method: 'put',
      data: {
        ...data,
        sourceId: this.projectId,
      },
    });
  }

  enableProjectPinelineTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_pipeline/enable`,
      method: 'put',
      params,
    });
  }

  invalidProjectPinelineTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_pipeline/invalid`,
      method: 'put',
      params,
    });
  }

  getProjectPinelineCategory(params:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_category/list`,
      method: 'get',
      params,
    });
  }

  getProjectPinelineVariableById(tempId: any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_variable/ci_pipeline_template/${tempId}`,
      method: 'get',
    });
  }

  checkProjectPinelineName(params: any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_pipeline/check/name/unique`,
      method: 'get',
      params,
    });
  }

  deleteProjectPinelineTemplate(temId:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_pipeline/${temId}`,
      method: 'delete',
    });
  }

  //  项目层任务模板
  getProjectTasksTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job/page`,
      method: 'get',
      params,
    });
  }

  getProjectTasksTemplateDetail(id:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job/${id}`,
      method: 'get',
    });
  }

  getProjectTasksTemplateListByGroupId(id:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job`,
      method: 'get',
      params: {
        ci_template_job_group_id: id,
      },
    });
  }

  getProjectTasksTemplateGroup() {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job_group`,
      method: 'get',
    });
  }

  getProjectTasksTemplateGroupList() {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job_group/list`,
      method: 'get',
    });
  }

  getProjectTasksTemplateList() {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job/list`,
      method: 'get',
    });
  }

  createProjectTasksTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job`,
      method: 'post',
      data: {
        ...data,
        builtIn: false,
        sourceId: this.projectId,
        sourceType: 'project',
      },
    });
  }

  modifyProjectTasksTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job`,
      method: 'put',
      data,
    });
  }

  getProjectTasksCategory(params:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job_group`,
      method: 'get',
      params,
    });
  }

  checkIfCanDelProjectTasksTemplate(temId:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job/${temId}/check/delete`,
      method: 'get',
    });
  }

  deleteProjectTasksTemplate(temId:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_job/${temId}`,
      method: 'delete',
    });
  }

  //  项目层步骤模板
  getProjectStepsTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_step`,
      method: 'get',
      params,
    });
  }

  createProjectStepsTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_step`,
      method: 'post',
      data: {
        ...data,
        builtIn: false,
        sourceId: this.projectId,
        sourceType: 'project',
      },
    });
  }

  modifyProjectStepsTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_step`,
      method: 'put',
      data,
    });
  }

  getProjectStepsCategory(params:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_step_category`,
      method: 'get',
      params,
    });
  }

  checkIfCanDelProjectStepsTemplate(temId:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_step/${temId}/check/delete`,
      method: 'get',
    });
  }

  deleteProjectStepsTemplate(temId:any) {
    return this.request({
      url: `${this.prefix}/${this.projectId}/ci_template_step/${temId}`,
      method: 'delete',
    });
  }
}

const devopsProjectApi = new DevopsProjectApi();
const devopsProjectApiConfig = new DevopsProjectApi(true);
export { devopsProjectApi, devopsProjectApiConfig };
