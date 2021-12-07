import Api from '../../Api';

class IssuesApi extends Api<IssuesApi> {
  get prefix() {
    return `/agile/v1/projects/${this.projectId}/issues`;
  }

  loadSummaryData(selectedProjectId:string, page:number|string, data?:any) {
    return this.request({
      url: `/agile/v1/projects/${selectedProjectId}/issues/summary?page=${page}&size=10`,
      method: 'post',
      data,
    });
  }
}

const issuesApi = new IssuesApi();
const issuesApiConfig = new IssuesApi(true);
export { issuesApi, issuesApiConfig };
