import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from '@/components/axios';
import { getProjectId, getOrganizationId } from '@/utils/getId';

class Api<T> {
  isConfig: boolean;

  constructor(isConfig: boolean = false) {
    this.isConfig = isConfig;
  }

  request(AxiosConfig: AxiosRequestConfig):any {
    if (this.isConfig) {
      return AxiosConfig;
    }
    return axios(AxiosConfig);
  }

  get projectId() {
    return getProjectId();
  }

  get orgId() {
    return getOrganizationId();
  }

  /**
   * 目的：达到api.project(2).getList()中getList获取的projectId为2，而不是当前projectId
   * @param Property 要覆盖的key
   * @param value 要覆盖的值
   */
  overwrite(Property: string, value: any): T {
    // 以当前this为模板，创建一个新对象
    const temp = Object.create(this);
    // 不直接temp[Property] = value;的原因是，如果这个属性只有getter，会报错
    Object.defineProperty(temp, Property, {
      get() {
        return value;
      },
    });
    // 返回新对象
    return temp;
  }

  project(projectId: string | number | undefined) {
    if (projectId) {
      return this.overwrite('projectId', projectId);
    }
    return this;
  }

  org(orgId: string | number | undefined) {
    if (orgId) {
      return this.overwrite('orgId', orgId);
    }
    return this;
  }
}

export default Api;
