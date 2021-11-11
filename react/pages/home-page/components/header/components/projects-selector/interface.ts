import { StoreProps } from './stores/useStore';

export type ProjectsSelectorIndexProps = {
};

export type ProjectsSelectorStoreContext = {
  prefixCls: 'c7ncd-projects-selector'
  intlPrefix: 'c7ncd.projects.selector'
  mainStore: StoreProps
  formatMessage(arg0: object, arg1?: object): string,
  projectId:string
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & ProjectsSelectorIndexProps;
