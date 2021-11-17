import { CSSProperties, ReactNode } from 'react';
import { StoreProps } from './stores/useStore';

export type UserAvatarIndexProps = {
};

export type UserAvatarStoreContext = {
  prefixCls: 'c7ncd-user-avatar'
  intlPrefix: 'c7ncd.user.avatar'
  mainStore: StoreProps
  formatMessage(arg0: object, arg1?: object): string,
  projectId:string
  organizationId:string
  imageUrl?:string,
  realName?:string,
  email?:string,
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any

} & UserAvatarIndexProps;

export type AvatarProps = {
  src?:string,
  [fields:string]:any
}
