import Api from '@/apis/Api';
import AppState from '@/containers/stores/c7n/AppState';
import { User } from '@/types';

class UserApi extends Api<UserApi> {
  get prefix() {
    return `/iam/choerodon/v1/projects/${this.projectId}`;
  }

  /**
 * 根据用户id查询用户信息
 * @param userId
 */
  getById(userId: string | string) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/users`,
      params: {
        id: userId,
      },
    });
  }

  /**
   * 在项目层查询用户列表（不包括离职用户）
   * @param param 模糊搜索
   * @param page
   * @param id 根据id查询
   */
  getAllInProject(param?: string, page?: number, userId?: number, size?: number, projectId?: string): Promise<{
    list: User[]
    hasNextPage: boolean
    number: number
  }> {
    // @ts-ignore
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/projects/${projectId || AppState.currentMenuType.id}/users`,
      params: {
        param,
        id: userId,
        page: page || 1,
        size: size || 20,
      },
      // cache: true,
    });
  }
}

const userApi = new UserApi();

export { userApi };
