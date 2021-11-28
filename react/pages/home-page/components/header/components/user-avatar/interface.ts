import { IntlFormatters } from 'react-intl';
import { StoreProps } from './stores/useStore';

export type UserAvatarIndexProps = {
};

export type UserAvatarStoreContext = {
  prefixCls: 'c7ncd-user-avatar'
  intlPrefix: 'c7ncd.user.avatar'
  mainStore: StoreProps
  projectId:string
  organizationId:string
  imageUrl?:string,
  realName?:string,
  email?:string,
  formatCommon:IntlFormatters['formatMessage']
  formatUserAvater:IntlFormatters['formatMessage']
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & UserAvatarIndexProps;

export type AvatarProps = {
  src?:string,
  [fields:string]:any
}
