import { action, computed, observable } from 'mobx';
import omit from 'object.omit';
import sortBy from 'lodash/sortBy';
import findIndex from 'lodash/findIndex';
import pick from 'lodash/pick';
import queryString from 'query-string';
import { handleResponseError } from '@/utils';
import store from '../../components/c7n/tools/store';
import axios from '../../components/c7n/tools/axios';

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
  } else {
    collection.unshift(value);
    return collection.slice(0, number);
  }
}

@store('HeaderStore')
class HeaderStore {
  @observable roles = [];

  @observable orgData = null;

  @observable proData = null;

  @observable selected = null;

  @observable recentItem = null;

  @observable userPreferenceVisible = false;

  @observable menuTypeVisible = false;

  @observable inboxVisible = false;

  @observable inboxDetailVisible = false;

  @observable inboxDetail = null;

  @observable inboxData = [];

  @observable inboxActiveKey = '1';

  @observable stickData = [];

  @observable inboxLoaded = false;

  @observable currentMsgType = 'msg';

  @observable announcement = {};

  @observable announcementClosed = true;

  @observable inboxLoading = true;

  @observable isTodo = false;

  @observable showSiteMenu = false;

  @observable unreadMessageCount = 0;

  @observable notificationKeyList = new Set();

  @action setInboxActiveKey(flag) {
    this.inboxActiveKey = flag;
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

  @action
  closeAnnouncement() {
    this.announcementClosed = true;
    window.localStorage.setItem('lastClosedId', `${this.announcement.id}`);
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
      routeChangeCancel: false,
      enabledCancelMark: false,
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
    return sortBy(this.inboxData.filter(item => !this.isTodo || item.backlogFlag), ['read']);
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

  @computed
  get getSelected() {
    return this.selected;
  }

  @action
  setSelected(data) {
    this.selected = data;
  }

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
  get getShowSiteMenu() {
    return this.showSiteMenu;
  }

  @action
  setShowSiteMenu(flag) {
    this.showSiteMenu = flag;
  }

  @computed
  get getUnreadMessageCount() {
    return this.unreadMessageCount;
  }

  @action
  setUnreadMessageCount(data) {
    this.unreadMessageCount = data;
  }

  axiosGetPro(key, value) {
    return axios.post(`/iam/choerodon/v1/projects/query_by_option`, {
      [key]: value
    }).then((res) => {
      this.addProject(res[0]);
      return res[0];
    })
  }

  axiosGetOrgAndPro(userId) {
    return axios({
      method: 'get',
      routeChangeCancel: false,
      enabledCancelMark: false,
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

  axiosGetUserMsg(userId) {
    const params = new URLSearchParams();
    params.append('user_id', userId);
    params.append('page', 0);
    params.append('size', 9999);
    params.append('sort', 'read_flag,asc');
    params.append('sort', 'creationDate,desc');
    params.append('withContent', 1);
    const request = {
      params,
    };

    return axios.get('/hmsg/v1/0/messages/user', request)
      .then(action(({ list }) => {
        if (list && list.length) {
          list.forEach((item) => {
            const { messageId, subject, creationDate, readFlag } = item;
            item.read = readFlag === 1;
            item.id = messageId;
            item.title = subject;
            item.sendTime = creationDate;
          });
        }
        this.inboxData = list || [];
        this.inboxLoading = false;
        this.inboxLoaded = true;
      }))
      .catch(handleResponseError).finally(() => {
        this.inboxLoading = false;
      });
  }

  axiosGetNewSticky() {
    return axios({
      method: 'get',
      url: '/hmsg/choerodon/v1/system_notice/new_sticky',
      routeChangeCancel: false,
      enabledCancelMark: false,
    }).then(action((data) => {
      this.announcement = data;
      if (data && data.id && (!localStorage.lastClosedId || localStorage.lastClosedId !== `${data.id}`)) {
        this.announcementClosed = false;
      }
    })).catch(handleResponseError);
  }

  axiosShowSiteMenu() {
    return axios({
      url: '/iam/choerodon/v1/menus/site_menu_flag',
      method: 'get',
      routeChangeCancel: false,
      enabledCancelMark: false,
    }).then(action((data) => {
      this.setShowSiteMenu(data);
    })).catch(() => {
      this.setShowSiteMenu(false);
    });
  }

  axiosGetUnreadMessageCount() {
    return axios({
      url: 'hmsg/v1/0/messages/user/count',
      method: 'get',
      routeChangeCancel: false,
      enabledCancelMark: false,
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
        .map(recent => omit(recent, 'children'));
    }
    // return recents.filter(
    //   (value) => {
    //     let idx = -1;
    //     switch (value.type) {
    //       case ORGANIZATION_TYPE:
    //         // idx = findDataIndex(this.orgData, value);
    //         // return idx !== -1 && this.orgData[idx].into;
    //         return false;
    //       case PROJECT_TYPE:
    //         idx = findDataIndex(this.proData, value);
    //         return idx !== -1;
    //       default:
    //         return false;
    //     }
    //   },
    // );
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
        localStorage.recentItem = JSON.stringify(recentItem);
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
      localStorage.recentItem = JSON.stringify(recentItem);
      this.recentItem = recentItem;
    }
  }
}

const headerStore = new HeaderStore();

export default headerStore;
