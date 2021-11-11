import DataSet from 'choerodon-ui/pro/lib/data-set/DataSet';
import { StoreProps } from './stores/useStore';

export type InviteEntryIndexProps = {
};

export type InviteEntryStoreContext = {
  prefixCls: 'c7ncd-invite-entry'
  intlPrefix: 'c7ncd.invite.entry'
  mainStore: StoreProps
  formatMessage(arg0: object, arg1?: object): string,
  projectId:string
  formDs:DataSet
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & InviteEntryIndexProps;
