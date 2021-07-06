import { QueryKey } from 'react-query';
import AppState from '../containers/stores/c7n/AppState';

export interface OrganizationKeyConfig {
  key: QueryKey
  organizationId?: string
}
export default function useOrganizationKey(config: OrganizationKeyConfig): QueryKey {
  return [config.key, {
    type: 'organization',
    // @ts-ignore
    organizationId: config.organizationId ?? AppState.currentMenuType?.organizationId,
  }];
}
