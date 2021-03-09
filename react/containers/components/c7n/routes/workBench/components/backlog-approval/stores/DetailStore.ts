import {
  observable, action, computed, runInAction,
} from 'mobx';
import {
  Demand, IField,
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
}
export { DemandDetailStore };
export default new DemandDetailStore();
