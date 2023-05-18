import { action, computed, observable } from 'mobx';
import omit from 'object.omit';
import sortBy from 'lodash/sortBy';
import { isNil } from 'lodash';
import findIndex from 'lodash/findIndex';
import pick from 'lodash/pick';
import queryString from 'query-string';
import { handleResponseError } from '@/utils';
import store from '../../components/c7n/tools/store';
import jsonStringifySafty from '@/utils/jsonStringifySafty';
import axios from '@/components/axios';

const ORGANIZATION_TYPE = 'organization';
const PROJECT_TYPE = 'project';

function findDataIndex(collection, value) {
  return collection ? collection.findIndex(
    ({ id, organizationId }) => String(id) === String(value.id) && (
      (!organizationId && !value.organizationId)
      || String(organizationId) === String(value.organizationId)
    ),
  ) : -1;
}

// 保留多少recent内容
function saveRecent(collection = [], value, number) {
  const index = findDataIndex(collection, value);
  if (index !== -1) {
    collection.splice(index, 1);
    return [value].concat(collection.slice());
  }
  collection.unshift(value);
  return collection.slice(0, number);
}

@store('HeaderStore')
class HeaderStore {
  @observable inboxUrl = '';

  @action setInboxUrl(inboxUrl) {
    this.inboxUrl = inboxUrl;
  }

  @computed
  get getInboxUrl() {
    return this.inboxUrl;
  }

  @observable unReadStatus = false;

  @action setUnReadStatus(unReadStatus) {
    this.unReadStatus = unReadStatus;
  }

  @computed
  get getUnReadStatus() {
    return this.unReadStatus;
  }

  @observable roles = [];

  @observable announcementLists = new Map([]);

  @observable orgData = null;

  @observable proData = null;

  @observable recentItem = null;

  @observable userPreferenceVisible = false;

  @observable menuTypeVisible = false;

  @observable inboxVisible = false;

  @observable inboxDetailVisible = true;

  @observable inboxDetail = null;

  @observable inboxData = [];

  @observable inboxActiveKey = '1';

  @observable stickData = [];

  @observable inboxLoaded = false;

  @observable currentMsgType = 'msg';

  @observable announcement = {};

  @observable inboxLoading = true;

  @observable isTodo = false;

  @observable showSiteMenu = false;

  @observable unreadMessageCount = 0;

  @observable userMsgcurrentSize = 200;

  @observable userMsgCount = 0;

  @observable userMsghaveMore = false;

  @observable notificationKeyList = new Set();

  @action setInboxActiveKey(flag) {
    this.inboxActiveKey = flag;
  }

  // 插入公告
  @action innsertAnnouncement(identity, data) {
    this.announcementLists?.set(identity, data);
  }

  // 删除公告
  @action deleteAnnouncement(identity) {
    this.announcementLists?.delete(identity);
  }

  // 获取公告列表,Map
  @computed
  get getAnnouncementLists() {
    return this.announcementLists;
  }

  // 是否公告列表中有某个key， 默认是公告的key
  existAnnouncement(key) {
    return this.announcementLists.has(key || 'platform_announcement');
  }

  @action setIsTodo(_isTodo) {
    this.isTodo = _isTodo;
  }

  @action setInboxDetailVisible(value) {
    this.inboxDetailVisible = value;
  }

  @action setInboxDetail(value) {
    this.inboxDetail = value;
  }

  @action
  setInboxLoaded(flag) {
    this.inboxLoaded = flag;
  }

  @action
  setInboxLoading(flag) {
    this.inboxLoading = flag;
  }

  @computed
  get getRoles() {
    return this.roles;
  }

  @action setRoles(data) {
    this.roles = data;
  }

  axiosGetRoles() {
    axios({
      url: 'iam/hzero/v1/member-roles/self-roles',
      method: 'get',
    }).then((res) => {
      this.setRoles(res);
    });
  }

  @computed
  get getInboxActiveKey() {
    return this.inboxActiveKey;
  }

  @computed
  get getIsTodo() {
    return this.isTodo;
  }

  @computed
  get getUnreadAll() {
    return this.inboxData.slice();
  }

  @computed
  get getUnreadMsg() {
    // 这里有排序 先注释
    // return sortBy(this.inboxData.filter((item) => !this.isTodo || item.backlogFlag), ['read']);
    return this.inboxData;
  }

  @computed
  get getUnreadNotice() {
    return sortBy(this.inboxData, ['read']);
  }

  @computed
  get getUnreadOther() {
    return this.stickData;
  }

  @computed
  get getCurrentMsgType() {
    return this.currentMsgType;
  }

  @action
  setCurrentMsgType(newType) {
    this.currentMsgType = newType;
  }

  /** @type any */
  @computed
  get getOrgData() {
    return this.orgData;
  }

  @action
  setOrgData(data) {
    this.orgData = data;
  }

  @computed
  get getProData() {
    return this.proData;
  }

  @action
  setUserPreferenceVisible(userPreferenceVisible) {
    this.userPreferenceVisible = userPreferenceVisible;
  }

  @action
  setMenuTypeVisible(menuTypeVisible) {
    this.menuTypeVisible = menuTypeVisible;
  }

  @action
  setInboxVisible(inboxVisible) {
    this.inboxVisible = inboxVisible;
  }

  @computed
  get getUnreadMessageCount() {
    return this.unreadMessageCount;
  }

  @action
  setUnreadMessageCount(data) {
    this.unreadMessageCount = data;
  }

  @action
  setUserMsgcurrentSize(size) {
    this.userMsgcurrentSize = size;
  }

  @action
  setUserMsgCount(count) {
    this.userMsgCount = count;
  }

  @action
  setUserMsghaveMore(boolean) {
    this.userMsghaveMore = boolean;
  }

  axiosGetPro(key, value) {
    return axios.post('/cbase/choerodon/v1/projects/query_by_option', {
      [key]: value,
    }).then((res) => {
      this.addProject(res[0]);
      return res[0];
    });
  }

  axiosGetOrgAndPro(userId) {
    return axios({
      method: 'get',
      url: '/iam/choerodon/v1/users/self-tenants',
    }).then((data) => {
      data.forEach((value) => {
        value.id = value.tenantId;
        value.name = value?.tenantName;
        value.organizationId = value.id;
        value.type = ORGANIZATION_TYPE;
      });
      this.setOrgData(data);
      return data;
    });
  }

  axiosGetStick() {
    return axios.get(`/hmsg/choerodon/v1/system_notice/completed?${queryString.stringify({
      page: 1,
      size: 9999,
    })}`)
      .then(action(({ content }) => {
        this.stickData = content || [];
      }))
      .catch(handleResponseError);
  }

  axiosGetUserMsg(userId, readFlag) {
    const params = new URLSearchParams();
    params.append('user_id', userId);
    params.append('page', 0);
    params.append('size', this.userMsgcurrentSize);
    params.append('withContent', 1);
    if (readFlag) {
      params.append('readFlag', 0);
      params.append('userMessageTypeCode', 'MSG');
    } else {
      params.append('sort', 'read_flag,asc');
      params.append('sort', 'creationDate,desc');
    }
    const request = {
      params,
    };

    return axios.get('/hmsg/v1/0/messages/user', request)
      .then(action(({ list, hasNextPage, numberOfElements }) => {
        this.userMsghaveMore = hasNextPage;
        this.userMsgCount = numberOfElements;
        if (list && list.length) {
          list.forEach((item) => {
            const {
              messageId, subject, creationDate, readFlag,
            } = item;
            item.read = readFlag === 1;
            item.id = messageId;
            item.title = subject;
            item.sendTime = creationDate;
          });
        }
        this.inboxData = list || [];
        this.inboxLoading = false;
        this.inboxLoaded = true;
        if (!this.inboxDetail) {
          this.setInboxDetailVisible(true);
          this.setInboxDetail(list[0]);
        } else {
          const findData = pick(this.inboxDetail, ['id']);
          const findData2 = pick(this.inboxDetail, ['messageId']);
          const index = findIndex(list, findData);
          const index2 = findIndex(list, findData2);
          if (index == -1 && index2 == -1) {
            this.setInboxDetail(list[0]);
          }
        }
      }))
      .catch(handleResponseError).finally(() => {
        this.inboxLoading = false;
      });
  }

  axiosGetUnreadMessageCount() {
    return axios({
      url: `hmsg/choerodon/v1/messages/count?size=${this.userMsgcurrentSize}`,
      method: 'get',
    }).then(action((data) => {
      this.setUnreadMessageCount(data ? data.unreadMessageCount : 0);
    })).catch(() => {
      this.setUnreadMessageCount(0);
    });
  }

  @action
  setProData(data) {
    this.proData = data;
  }

  @action
  addProject(project) {
    project.type = PROJECT_TYPE;
    if (this.proData) {
      this.proData.unshift(project);
    } else {
      this.proData = [project];
    }
  }

  @action
  updateProject(project) {
    project.type = PROJECT_TYPE;
    if (this.proData) {
      const index = this.proData.findIndex(({ id }) => id === project.id);
      if (index !== -1) {
        this.proData.splice(index, 1, project);
      }
    }
    this.updateRecentItem(project);
  }

  @action
  addOrg(org) {
    org.type = ORGANIZATION_TYPE;
    if (this.orgData) {
      this.orgData.unshift(org);
    } else {
      this.orgData = [org];
    }
  }

  @action
  updateOrg(org) {
    org.type = ORGANIZATION_TYPE;
    if (this.orgData) {
      const index = this.orgData.findIndex(({ id }) => id === org.id);
      if (index !== -1) {
        this.orgData.splice(index, 1, org);
      }
    }
    this.updateRecentItem(org);
  }

  @computed
  get getRecentItem() {
    let recents = [];
    if (this.recentItem) {
      recents = this.recentItem;
    } else if (localStorage.recentItem) {
      recents = JSON.parse(localStorage.recentItem)
        .map((recent) => omit(recent, 'children'));
    }
    return recents;
  }

  @action
  readMsg(userId, data, readAll) {
    // const body = (data ? [].concat(data) : this.inboxData).map(({ id }) => id);
    const param = data && data.userMessageId ? `&userMessageIdList=${data.userMessageId}` : '';
    this.lookMsg(data);
    return axios.post(`/hmsg/v1/0/messages/user/read-flag?readAll=${readAll}&user_id=${userId}${param}`);
  }

  @action
  deleteMsg(userId, data) {
    // const body = (data ? [].concat(data) : this.inboxData).map(({ id }) => id);
    const param = data && data.userMessageId ? `&userMessageIdList=${data.userMessageId}` : '';
    this.clearMsg(data);
    return axios.delete(`/hmsg/v1/0/messages/user?user_id=${userId}${param}`);
  }

  @action
  cleanAllMsg(userId, data) {
    // const body = (data ? [].concat(data) : this.inboxData).map(({ id }) => id);
    this.clearMsg(data);
    return axios.delete(`/hmsg/choerodon/v1/messages/user/delete_all?user_id=${userId}`);
  }

  @action
  lookMsg(data) {
    if (data) {
      const findData = pick(data, ['id']);
      const index = findIndex(this.inboxData, findData);
      if (index !== -1) {
        this.inboxData[index].read = true;
      }
    } else {
      this.inboxData.forEach((list) => {
        list.read = true;
      });
    }
  }

  @action
  clearMsg(data) {
    if (data) {
      const index = this.inboxData.indexOf(data);
      if (index !== -1) {
        this.inboxData.splice(index, 1);
        this.inboxData = [...this.inboxData];
      }
    } else {
      this.inboxData = [];
    }
  }

  @action
  async loadMsgDetail(messageId) {
    try {
      const res = await axios.get(`/hmsg/choerodon/v1/messages/${messageId}`);
      if (res && !res.failed) {
        return ({
          ...res,
          id: res.messageId,
          title: res.subject,
          sendTime: res.creationDate,
        });
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  @action
  updateRecentItem(recent) {
    if (recent) {
      const recentItem = JSON.parse(localStorage.recentItem);
      const index = recentItem.findIndex(
        ({ id, organizationId }) => id === recent.id
          && (!organizationId || organizationId === recent.organizationId),
      );
      if (index !== -1) {
        recentItem.splice(index, 1, recent);
        localStorage.recentItem = jsonStringifySafty(recentItem);
        this.recentItem = recentItem;
      }
    }
  }

  @action
  setRecentItem(recent) {
    if (recent) {
      const recentItem = saveRecent(
        this.getRecentItem,
        omit(recent, 'children'), 10,
      );
      localStorage.recentItem = jsonStringifySafty(recentItem);
      this.recentItem = recentItem;
    }
  }
}

const headerStore = new HeaderStore();

export default headerStore;
