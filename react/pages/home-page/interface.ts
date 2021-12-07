import { StoreProps } from './stores/useStore';

export type HomePageIndexProps = {
};

export type HomePageStoreContext = {
  prefixCls: 'c7ncd-root'
  homeStore: StoreProps
  formatMessage(arg0: object, arg1?: object): string,
  projectId:string
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & HomePageIndexProps;
