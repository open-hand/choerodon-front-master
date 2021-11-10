import { StoreProps } from './stores/useStore';

export type HeaderIndexProps = {
};

export type HeaderStoreContext = {
  prefixCls: 'c7ncd-header'
  intlPrefix: 'c7ncd.header'
  mainStore: StoreProps
  formatMessage(arg0: object, arg1?: object): string,
  projectId:string
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & HeaderIndexProps;
