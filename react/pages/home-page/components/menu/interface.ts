import { StoreProps } from './stores/useStore';

export type SideMenuIndexProps = {
};

export type SideMenuStoreContext = {
  prefixCls: 'c7ncd-side-menu'
  intlPrefix: 'c7ncd.side.menu'
  mainStore: StoreProps
  type: 'site'| 'project' | 'organization' | 'user'
  formatMessage(arg0: object, arg1?: object): string,
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & SideMenuIndexProps;
