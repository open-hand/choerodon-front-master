import {
  observable, action, computed, runInAction,
} from 'mobx';
import {
  ApproveLog,
  Demand, IField, INodeHistory,
} from '../common/types';
import { demandApi } from '../api';

export type DemandTab = 'detail' | 'comment' | 'record' | 'feedback' | 'solve'
class DemandDetailStore {
  @observable loading: boolean = false;

  @observable organizationId: string | undefined;

  @observable projectId: number | string | undefined;

  @observable selectedMap = observable.map();

  @action
  select(demandId: string, projectId?: string) {
    if (!this.selectedMap.has(demandId)) {
      this.selectedMap.clear();
      this.selectedMap.set(demandId, true);
      if (projectId) {
        this.projectId = String(projectId);
      }
    }
  }

  @action
  unSelect(demandId: string) {
    this.selectedMap.delete(demandId);
  }

  @action
  close() {
    this.selectedMap.clear();
  }

  @action
  destroy() {
    this.selectedMap.clear();
    this.demand = {} as Demand;
    this.loading = false;
    this.projectId = undefined;
    this.organizationId = undefined;
  }

  @computed get visible() {
    return this.selectedMap.size > 0;
  }

  @computed get selected() {
    return [...this.selectedMap.keys()][0];
  }

  @observable customFields: IField[] = [];

  @action setCustomFields = (customFields: IField[]) => {
    this.customFields = customFields;
  }

  /**
   * api初始化， 外部与内部调用的接口在此进行判断
   * @param source
   */
  initApi(organizationId: string) {
    this.organizationId = organizationId;
  }

  @observable demand: Demand = {} as Demand;

  async load() {
    const demandId = this.selected;
    if (demandId) {
      this.loading = true;
      try {
        const demand = await demandApi.load(demandId, this.organizationId as string);
        runInAction(() => {
          this.demand = demand;
          this.loading = false;
        });
      } catch (error) {
        this.loading = false;
      }
    }
  }

  @action
  async getCustomFields(backlogId?: number) {
    const customFields = await demandApi.getCustomFields(backlogId || this.selected, this.demand.issueTypeId, this.organizationId as string);
    this.setCustomFields(customFields);
    return true;
  }

  async refresh(callback?: Function) {
    await this.load();
    await this.getCustomFields();
    if (callback) {
      callback();
    }
  }

  @observable approveLogs: ApproveLog[] = [];

  @action setApproveLogs = (data: ApproveLog[]) => {
    this.approveLogs = data;
  }

  @action
  async getApproveLogs(backlogId?: number) {
    // const logs = await demandApi.loadLogs(backlogId || this.selected);
    // const approveLogs: ApproveLog[] = [];

    // logs.forEach((item: INodeHistory) => {
    //   if (item.nodeName) {
    //     if (item.taskHistoryList?.length) {
    //       approveLogs.concat(item.taskHistoryList.map((taskHistory) => ({ ...taskHistory, nodeName: item.nodeName })));
    //     } else {
    //       approveLogs.push(item);
    //     }
    //   }
    // });
    const logs: ApproveLog[] = [
      {
        creationDate: '2021-03-09 16:01:54',
        createdBy: 11134,
        lastUpdateDate: '2021-03-09 16:01:54',
        lastUpdatedBy: 11134,
        objectVersionNumber: 2,
        taskHistoryId: 49,
        instanceId: 12,
        deploymentId: 5,
        nodeId: 43,
        nodeCode: '2d076ff9',
        nodeName: '开始节点',
        nodeType: 'startNode',
        historyType: 'NODE',
        startDate: '2021-03-09 16:01:54',
        endDate: '2021-03-09 16:01:54',
        tenantId: 1145,
        status: 'END',
        statusMeaning: '节点自动完成',
      },
      {
        creationDate: '2021-03-09 16:01:55',
        createdBy: 11134,
        lastUpdateDate: '2021-03-09 16:06:26',
        lastUpdatedBy: 22488,
        objectVersionNumber: 2,
        taskHistoryId: 52,
        instanceId: 12,
        deploymentId: 5,
        nodeId: 45,
        nodeCode: '8b15b748',
        nodeName: '需求审核',
        nodeType: 'DEFAULT',
        historyType: 'TASK',
        assignee: {
          name: '李文斐（20615）',
          loginName: '20615',
          realName: '李文斐',
          imageUrl: 'https://minio.choerodon.com.cn/iam-service/file_219ce90e5973404ca351485453de2c8d_A63D7C242F3DAC79F718E11F56595B8F.jpg',
          email: 'wenfei.li@hand-china.comabcd',
          ldap: true,
          id: '=Ijvim1_2kZP5GiVstnYwkcxqCXVlGB5ZRM6THFEcqw4==',
        },
        taskId: 7,
        startDate: '2021-03-09 16:01:55',
        endDate: '2021-03-09 16:06:26',
        tenantId: 1145,
        status: 'APPROVED',
        parentNodeId: 44,
        commentContent: 'very good',
        statusMeaning: '审批同意',
      },
      {
        creationDate: '2021-03-09 16:06:26',
        createdBy: 22488,
        lastUpdateDate: '2021-03-09 16:06:26',
        lastUpdatedBy: 22488,
        objectVersionNumber: 1,
        taskHistoryId: 53,
        instanceId: 12,
        deploymentId: 5,
        nodeId: 45,
        nodeCode: '8b15b748',
        nodeName: '需求审核',
        nodeType: 'DEFAULT',
        historyType: 'ACTION',
        assignee: {
          name: '李文斐（20615）',
          loginName: '20615',
          realName: '李文斐',
          imageUrl: 'https://minio.choerodon.com.cn/iam-service/file_219ce90e5973404ca351485453de2c8d_A63D7C242F3DAC79F718E11F56595B8F.jpg',
          email: 'wenfei.li@hand-china.comabcd',
          ldap: true,
          id: '=Ijvim1_2kZP5GiVstnYwkcxqCXVlGB5ZRM6THFEcqw4==',
        },
        taskId: 7,
        startDate: '2021-03-09 16:01:55',
        endDate: '2021-03-09 16:06:26',
        tenantId: 1145,
        status: 'APPOINT_NEXT_NODE_APPROVER',
        toPerson: '01',
        remark: '指定下一审批人给[Jackson Yee(01)  ]',
        parentNodeId: 44,
        statusMeaning: '指定下一审批人',
      },
      {
        creationDate: '2021-03-09 16:06:27',
        createdBy: 22488,
        lastUpdateDate: '2021-03-09 16:07:52',
        lastUpdatedBy: 11134,
        objectVersionNumber: 3,
        taskHistoryId: 56,
        instanceId: 12,
        deploymentId: 5,
        nodeId: 47,
        nodeCode: '599537e2',
        nodeName: '晓燕审核',
        nodeType: 'DEFAULT',
        historyType: 'TASK',
        assignee: {
          name: '李文斐（20615）',
          loginName: '20615',
          realName: '李文斐',
          imageUrl: 'https://minio.choerodon.com.cn/iam-service/file_219ce90e5973404ca351485453de2c8d_A63D7C242F3DAC79F718E11F56595B8F.jpg',
          email: 'wenfei.li@hand-china.comabcd',
          ldap: true,
          id: '=Ijvim1_2kZP5GiVstnYwkcxqCXVlGB5ZRM6THFEcqw4==',
        },
        taskId: 8,
        startDate: '2021-03-09 16:06:27',
        endDate: '2021-03-09 16:07:52',
        tenantId: 1145,
        status: 'REBUT',
        remark: '【晓燕审核】 驳回至 【开始节点】',
        parentNodeId: 46,
        statusMeaning: '驳回',
      },
      {
        creationDate: '2021-03-09 16:07:52',
        createdBy: 11134,
        lastUpdateDate: '2021-03-09 16:07:52',
        lastUpdatedBy: 11134,
        objectVersionNumber: 2,
        taskHistoryId: 57,
        instanceId: 12,
        deploymentId: 5,
        nodeId: 48,
        nodeCode: '2d076ff9',
        nodeName: '开始节点',
        nodeType: 'startNode',
        historyType: 'NODE',
        startDate: '2021-03-09 16:07:52',
        endDate: '2021-03-09 16:07:52',
        tenantId: 1145,
        status: 'END',
        parentNodeId: 47,
        statusMeaning: '节点自动完成',
      },
      {
        creationDate: '2021-03-09 16:48:49',
        createdBy: 22488,
        lastUpdateDate: '2021-03-09 16:48:49',
        lastUpdatedBy: 22488,
        objectVersionNumber: 1,
        taskHistoryId: 66,
        instanceId: 12,
        deploymentId: 5,
        nodeId: 50,
        nodeCode: '8b15b748',
        nodeName: '需求审核',
        nodeType: 'DEFAULT',
        historyType: 'ACTION',
        assignee: {
          name: '柴晓燕（20754）',
          loginName: '20754',
          realName: '柴晓燕',
          imageUrl: 'https://minio.choerodon.com.cn/iam-service/file_d7ae9caa4abb4258b23933f16b88204f_d51b5d6b60b4b83613c7850817bf6223.jpg',
          email: 'xiaoyan.chai@hand-china.comabcd',
          ldap: true,
          id: '=tJKyNnw9-0_qf1JOJ0yZYcxqCXVlGB5ZRM6THFEcqw4==',
        },
        taskId: 9,
        startDate: '2021-03-09 16:07:52',
        endDate: '2021-03-09 16:48:49',
        tenantId: 1145,
        status: 'BEFORE_SIGN',
        toPerson: '05',
        remark: '加签给[李文斐(05)  ],优秀',
        parentNodeId: 49,
        statusMeaning: '前加签',
      },
      {
        creationDate: '2021-03-09 16:48:49',
        createdBy: 22488,
        lastUpdateDate: '2021-03-09 16:56:33',
        lastUpdatedBy: 10635,
        objectVersionNumber: 2,
        taskHistoryId: 67,
        instanceId: 12,
        deploymentId: 5,
        nodeId: 50,
        nodeCode: '8b15b748',
        nodeName: '需求审核',
        nodeType: 'BEFORE_SIGN',
        historyType: 'TASK',
        assignee: {
          name: '超级管理员（abcadmin@hzero.abccom）',
          loginName: 'admin',
          realName: '超级管理员',
          imageUrl: 'https://minio.choerodon.com.cn/iam-service/c503fc3897810b974fa23c8712df06a6.jpg/0/adc12e4bd3e94fcfb8d45500abaaa915@c503fc3897810b974fa23c8712df06a6.jpg',
          email: 'abcadmin@hzero.abccom',
          ldap: false,
          id: '=FQJoa9MBnSAXknlY3CiK3w===',
        },
        taskId: 12,
        startDate: '2021-03-09 16:48:49',
        endDate: '2021-03-09 16:56:33',
        tenantId: 1145,
        status: 'REJECTED',
        parentTaskId: 9,
        parentNodeId: 49,
        commentContent: 'lwf1审批',
        statusMeaning: '审批拒绝',
        attachmentUuid: '11457970ce2f71294fdebde4187fab645437',
      },
    ];
    this.setApproveLogs(logs);
  }
}
export { DemandDetailStore };
export default new DemandDetailStore();
