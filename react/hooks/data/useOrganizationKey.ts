import { QueryKey } from 'react-query';
import { getOrganizationId } from '@/utils/getId';

export interface OrganizationKeyConfig {
  key: QueryKey
  organizationId?: string
}
/**
 * 获取`react-query`所需的key（会加上当前组织id）
 * @param config
 * @returns
 */
export default function useOrganizationKey(config: OrganizationKeyConfig): QueryKey {
  return [config.key, {
    type: 'organization',
    organizationId: config.organizationId ?? getOrganizationId(),
  }];
}
