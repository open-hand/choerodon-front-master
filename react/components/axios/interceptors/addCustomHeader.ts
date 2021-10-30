import { AxiosRequestConfig } from 'axios';
import {
  getAccessToken,
} from '@/utils';
import MenuStore from '@/containers/stores/c7n/MenuStore';
import cursiveSetCorrectId from '../utils/cursiveSetCorrectedId';

export default function addCustomHeader(config: AxiosRequestConfig) {
  const newConfig = config;
  const str = window.location.hash.split('?')[1];
  const urlSearchParam = new URLSearchParams(str);
  const type = urlSearchParam.get('type');
  const orgId = urlSearchParam.get('organizationId');
  const id = !type || type === 'site' ? 0 : orgId || 0;

  newConfig.headers['Content-Type'] = 'application/json';
  newConfig.headers.Accept = 'application/json';
  newConfig.headers['H-Tenant-Id'] = id;

  let correctId = 0;
  const flag = 0;

  if (MenuStore.activeMenu) {
    let data;
    const { level } = MenuStore.activeMenu;
    const menuGroup = JSON.parse(localStorage.getItem('menuGroup') ?? '');

    if (['site', 'users'].includes(level)) {
      data = menuGroup[level];
    } else {
      data = menuGroup[level][urlSearchParam.get('id') ?? ''];
    }
    if (data) {
      correctId = cursiveSetCorrectId(data, correctId, flag);
    }
  }

  newConfig.headers['H-Menu-Id'] = correctId || 0;
  const accessToken = getAccessToken();
  if (accessToken) {
    newConfig.headers.Authorization = accessToken;
  }

  return newConfig;
}
