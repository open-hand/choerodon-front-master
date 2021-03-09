// @ts-nocheck
import { axios } from '@/index';
import { ApproveLog, Demand, IField } from '../common/types';

class DemandApi {
  get prefix() {
    return '/agile/v1/projects/1528';
  }

  load(demandId: string, organizationId: string): Promise<Demand> {
    // @ts-ignore
    return axios({
      method: 'get',
      url: `${this.prefix}/backlog/${demandId}`,
      params: {
        organizationId,
      },
    }) as unknown as Promise<Demand>;
  }

  getCustomFields(backlogId: string, typeId: string, organizationId: string): Promise<IField[]> {
    return axios({
      method: 'post',
      url: `${this.prefix}/field_value/list/${backlogId}`,
      params: {
        organizationId,
      },
      data: {
        issueTypeId: typeId,
        context: 'backlog',
        pageCode: 'agile_issue_edit',
        schemeCode: 'backlog',
      },
    }) as unknown as Promise<IField[]>;
  }

  loadLogs(backlogId: string): Promise<ApproveLog[]> {
    return axios({
      method: 'get',
      url: `${this.prefix}/backlog_data_log/list`,
      params: {
        backlogId,
      },
    });
  }
}

const demandApi = new DemandApi();
export { demandApi };
