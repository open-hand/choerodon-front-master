import { QueryKey } from 'react-query';
import { getProjectId } from '@/utils/getId';

export interface ProjectKeyConfig {
  key: QueryKey
  projectId?: string
}
/**
 * 获取`react-query`所需的key（会加上当前项目id）
 * @param config
 * @returns
 */
export default function useProjectKey(config: ProjectKeyConfig): QueryKey {
  return [config.key, {
    type: 'project',
    projectId: config.projectId ?? getProjectId(),
  }];
}
