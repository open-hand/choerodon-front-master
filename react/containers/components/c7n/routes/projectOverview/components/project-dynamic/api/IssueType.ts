import Api from './Api';

export interface ICreate {
  name: string
  icon: string
  description: string
  colour: string
}

export interface IUpdate extends ICreate {
  id: string
}
class IssueTypeApi extends Api<IssueTypeApi> {
  get prefix() {
    return `/agile/v1/projects/${this.projectId}`;
  }

  get OrgPrefix() {
    return `/agile/v1/organizations/${this.orgId}`;
  }

  /**
   * 查询当前项目或组织下可配置的问题类型
   *
   */
  loadAvailableIssueType() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/object_scheme_field/configs/issue_types`,
      params: {
        organizationId: this.orgId,
      },
    });
  }
}

const issueTypeApi = new IssueTypeApi();
const issueTypeApiConfig = new IssueTypeApi(true);
export { issueTypeApi, issueTypeApiConfig };
