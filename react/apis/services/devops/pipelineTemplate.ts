/* eslint-disable camelcase */
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
  checkStepClassName(sourceId:string, name:string, id:string) {
    return this.request({
      url: id ? `${this.prefix}/${sourceId}/ci_template_step_category/check/name/unique?name=${name}&ci_template_category_id=${id}` : `${this.prefix}/${sourceId}/ci_template_step_category/check/name/unique?name=${name}`,
      method: 'get',
    });
  }

  // 添加流水线分类中，校验流水线分类名称的唯一性
  checkPipelineClassName(sourceId:string, name:string, id:string) {
    return this.request({
      url: id ? `${this.prefix}/${sourceId}/ci_template_category/check/name/unique?name=${name}&ci_template_category_id=${id}` : `${this.prefix}/${sourceId}/ci_template_category/check/name/unique?name=${name}`,
      method: 'get',
    });
  }

  // 添加任务分组中，校验任务分组名称的唯一性
  checkTaskGroupName(sourceId:string, name:string, id:string) {
    return this.request({
      url: id ? `${this.prefix}/${sourceId}/ci_template_job_group/check/name/unique?name=${name}&template_job_id=${id}` : `${this.prefix}/${sourceId}/ci_template_job_group/check/name/unique?name=${name}`,
      method: 'get',
    });
  }

  // 创建流水线模板中，校验基本信息名称的唯一性
  checkCreatePipelineName({ name, id }:any) {
    return this.request({
      url: id ? `${this.prefix}/0/ci_pipeline_template/check/name/unique?name=${name}&ci_template_id=${id}` : `${this.prefix}/0/ci_pipeline_template/check/name/unique?name=${name}`,
      method: 'get',
    });
  }

  // 创建流水线模板 不分页获取任务分组列表
  getTaskGroupList(sourceId:String) {
    return this.request({
      url: `${this.prefix}/0/ci_template_job_group/list`,
      method: 'get',
    });
  }

  // 分页获取任务分组列表
  getTaskTemplateGroupList(sourceId:String) {
    return this.request({
      url: `${this.prefix}/0/ci_template_job_group`,
      method: 'get',
    });
  }

  // 获取任务id查询job列表
  getTasksTemplateListByGroupId(groupId:String) {
    return this.request({
      url: `${this.prefix}/0/ci_template_job?ci_template_job_group_id=${groupId}`,
      method: 'get',
    });
  }

  // 获取变量
  getVariableById(id:String) {
    return this.request({
      url: `${this.prefix}/0/ci_template_variable/ci_pipeline_template/${id}`,
      method: 'get',
    });
  }

  // 获取流水线模板
  getPinelineTemplateById(id:String) {
    return this.request({
      url: `${this.prefix}/0/ci_pipeline_template/${id}`,
      method: 'get',
    });
  }

  // 创建流水线模板
  createPinelineTemplate(data:object) {
    return this.request({
      url: `${this.prefix}/0/ci_pipeline_template`,
      method: 'post',
      data,
    });
  }

  // 修改流水线模板
  editPinelineTemplate(data:object) {
    return this.request({
      url: `${this.prefix}/0/ci_pipeline_template`,
      method: 'put',
      data,
    });
  }

  // 获取流水线分类
  getSitePinelineCategory(params:any) {
    return this.request({
      url: `${this.prefix}/0/ci_template_category`,
      method: 'get',
      params,
    });
  }

  // 创建任务模板
  createTaskTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/0/ci_template_job`,
      method: 'post',
      data,
    });
  }

  // 修改任务模板
  editTaskTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/0/ci_template_job`,
      method: 'put',
      data,
    });
  }

  // 创建步骤模板
  createStepTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/0/ci_template_step`,
      method: 'post',
      data,
    });
  }

  // 修改步骤模板
  editStepTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/0/ci_template_step`,
      method: 'put',
      data,
    });
  }

  // 根据id查询job详情
  getJobDetailById(id:string) {
    return this.request({
      url: `${this.prefix}/0/ci_template_job/${id}`,
      method: 'get',
    });
  }
}

const pipelineTemplateApi = new PipelineTemplateApi();
const pipelineTemplateApiConfig = new PipelineTemplateApi(true);
export { pipelineTemplateApi, pipelineTemplateApiConfig };
