import stores from '@/containers/stores';

// @ts-ignore
const { AppState } = stores;

export const getIsOrganization = () => (AppState.currentMenuType ? AppState.currentMenuType.type === 'organization' : undefined);
export const getProjectId = () => (AppState.currentMenuType ? AppState.currentMenuType.id : 0);
export const getProjectName = () => (AppState.currentMenuType ? AppState.currentMenuType.name : '');
export const getOrganizationId = () => (AppState.currentMenuType
  ? AppState.currentMenuType.organizationId
  : 0);
export const getUserId = () => AppState.userInfo?.id || 0;
export const getMenuType = () => (AppState.currentMenuType ? AppState.currentMenuType.type : '');

export function sameProject(projectId: string): boolean {
  if (!projectId) {
    return true;
  }
  const same = String(projectId) === String(getProjectId());
  return same;
}
export function getRequestProjectId(projectId?: string) {
  const same = String(projectId) === String(getProjectId());
  return same || getMenuType() === 'project' ? getProjectId() : projectId;
}
