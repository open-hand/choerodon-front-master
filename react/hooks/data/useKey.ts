import { QueryKey } from 'react-query';
import { getIsOrganization } from '@/utils/isOrganization';
import { getOrganizationId, getProjectId } from '@/utils/getId';

export interface keyConfig {
  key: QueryKey
  id?: string
}
/**
 * 获取`react-query`所需的key（会自动判断当前层级，再加上当前项目id或当前组织id）
 * @param config
 * @returns
 */
export default function useKey(config: keyConfig): QueryKey {
  const isOrganization = getIsOrganization();
  return [config.key, {
    type: isOrganization ? 'organization' : 'project',
    projectOrOrgId: config.id ?? isOrganization ? getOrganizationId() : getProjectId(),
  }];
}
