import stores from '@/containers/stores';

// @ts-ignore
const { AppState } = stores;
/**
 * 判断当前是否是组织层
 * @returns
 */
export function getIsOrganization() {
  // @todo 临时强制as
  return (AppState.currentMenuType ? (AppState.currentMenuType as unknown as any).type === 'organization' : false);
}
