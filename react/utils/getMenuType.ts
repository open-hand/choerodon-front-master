import stores from '@/containers/stores';

const { AppState } = stores;
/**
 * 获取当前菜单所属层级类型
 * '' 空字符串代表当前菜单异常
 * @returns
 */
export const getMenuType = (): 'organization' | 'project' | '' => (AppState.currentMenuType ? (AppState.currentMenuType as unknown as any).type : '');
