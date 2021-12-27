import Api from '../../Api';

class PipelineTemplateApi extends Api<PipelineTemplateApi> {
  get prefix() {
    return '/devops/v1/site';
  }

  // 删除步骤分类
  deleteStepClass(sourceId:String, templateCategoryId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_step_category/${templateCategoryId}`,
      method: 'delete',
    });
  }

  // 删除流水线分类
  deletePipelineClass(sourceId:String, templateCategoryId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_category/${templateCategoryId}`,
      method: 'delete',
    });
  }

  // 删除任务分组
  deleteTaskGroup(sourceId:String, TaskGroupId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_job_group/${TaskGroupId}`,
      method: 'delete',
    });
  }

  // 校验步骤是否可以删除
  checkStepTemplateDelete(sourceId:String, templateStepId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_step/${templateStepId}/check/delete`,
      method: 'get',
    });
  }

  // 校验任务是否可以删除
  checkTaskTemplateDelete(sourceId:String, templateIobId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_job/${templateIobId}/check/delete`,
      method: 'get',
    });
  }

  // 删除步骤模板
  deleteStepTemplate(sourceId:String, templateStepId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_step/${templateStepId}`,
      method: 'delete',
    });
  }

  // 删除任务模板
  deleteTaskTemplate(sourceId:String, templateTaskId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_job/${templateTaskId}`,
      method: 'delete',
    });
  }

  // 删除流水线模板
  deletePipelineTemplate(sourceId:String, templatePipelineId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_pipeline_template/${templatePipelineId}`,
      method: 'delete',
    });
  }

  // 启用流水线模板
  enablePipelineTemplate(sourceId:String, templatePipelineId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_pipeline_template/enable?ci_pipeline_template_id=${templatePipelineId}`,
      method: 'PUT',
    });
  }

  // 停用流水线模板
  stopPipelineTemplate(sourceId:String, templatePipelineId:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_pipeline_template/invalid?ci_pipeline_template_id=${templatePipelineId}`,
      method: 'PUT',
    });
  }

  // 添加步骤分类中，校验步骤分类名称的唯一性
  checkStepClassName(sourceId:string, name:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_step_category/check/name/unique?name=${name}`,
      method: 'get',
    });
  }

  // 添加流水线分类中，校验流水线分类名称的唯一性
  checkPipelineClassName(sourceId:string, name:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_category/check/name/unique?name=${name}`,
      method: 'get',
    });
  }

  // 添加任务分组中，校验任务分组名称的唯一性
  checkTaskGroupName(sourceId:string, name:string) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_job_group/check/name/unique?name=${name}`,
      method: 'get',
    });
  }

  // 获取任务分组列表
  getTaskGroupList(sourceId:String) {
    return this.request({
      url: `${this.prefix}/${sourceId}/ci_template_job_group`,
      method: 'get',
    });
  }
}

const pipelineTemplateApi = new PipelineTemplateApi();
const pipelineTemplateApiConfig = new PipelineTemplateApi(true);
export { pipelineTemplateApi, pipelineTemplateApiConfig };
