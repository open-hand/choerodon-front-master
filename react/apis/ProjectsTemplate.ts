import Api from './Api';

class ProjectTemplateApi extends Api<ProjectTemplateApi> {
  get prefix() {
    return `/iam/choerodon/v1/projects/${this.projectId}`;
  }

  get orgPrefix() {
    return `/cbase/choerodon/v1/organizations/${this.orgId}/project_template`;
  }

  // 获取模板分类列表
  getList() {
    return this.request({
      method: 'get',
      url: `/cbase/choerodon/v1/organizations/${this.orgId}/project_template_classfication/list`,
    });
  }

  isRepeat(name:string) {
    return this.request({
      method: 'get',
      url: `/cbase/choerodon/v1/organizations/${this.orgId}/project_template_classfication/is_repeat?name=${name}`,
    });
  }

  // 创建模板分类
  createTemplateClass(data:{organizationId:string, name:string}) {
    return this.request({
      method: 'post',
      url: `/cbase/choerodon/v1/organizations/${this.orgId}/project_template_classfication`,
      data,
    });
  }

  getTemplateReferenceCount(id:string) {
    return this.request({
      method: 'get',
      url: `/cbase/choerodon/v1/organizations/${this.orgId}/project_template_classfication/template_reference_count? id=${id}`,
    });
  }

  // 删除模板分类
  deleteTemplate(id:string, newTemplateClassficationId?:string) {
    return this.request({
      method: 'delete',
      url: newTemplateClassficationId ? `/cbase/choerodon/v1/organizations/${this.orgId}/project_template_classfication? id=${id}&newTemplateClassficationId=${newTemplateClassficationId}`
        : `/cbase/choerodon/v1/organizations/${this.orgId}/project_template_classfication? id=${id}`,
    });
  }

  // 模板使用明细
  templateUseDetail(id:string) {
    return this.request({
      method: 'get',
      url: `/cbase/choerodon/v1/organizations/${this.orgId}/project_template/use_detail/${id}`,
    });
  }

  // 模板分类详情
  pagingProjectTemplates(classficationId?:string) {
    return this.request({
      method: 'post',
      url: classficationId ? `/cbase/choerodon/v1/organizations/${this.orgId}/project_template/paging? classfication_id=${classficationId}` : `/cbase/choerodon/v1/organizations/${this.orgId}/project_template/paging`,
    });
  }

  // 发布取消发布模板
  publishTemplate(id:string, value:string) {
    return this.request({
      method: 'put',
      url: `/cbase/choerodon/v1/organizations/${this.orgId}/project_template/publish/${id}? publish_value=${value}`,
    });
  }

  // 获取rank值
  getRank(id:string, data?:any) {
    return this.request({
      method: 'post',
      url: `cbase/choerodon/v1/organizations/${this.orgId}/project_template/${id}/rank`,
      data,
    });
  }
}

const projectTemplateApi = new ProjectTemplateApi();
const projectTemplateApiConfig = new ProjectTemplateApi(true);
export { projectTemplateApi, projectTemplateApiConfig };
