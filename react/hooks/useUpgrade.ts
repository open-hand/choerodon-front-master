import { useQuery, UseQueryOptions } from 'react-query';
import { get as getInject } from '@choerodon/inject';
import useOrganizationKey from './useOrganizationKey';
import useExternalFunc from '@/hooks/useExternalFunc';

export interface UpgradeConfig {
  organizationId: string
  checkUpgrade: undefined | ((organizationId:string)=> Promise<any>)
}

// const checkUpgrade = (organizationId: string) => {
//   if (getInject('base-saas:checkUpgrade')) {
//     return getInject('base-saas:checkUpgrade')(organizationId);
//   }
//   return false;
// };

export default function useUpgrade(config: UpgradeConfig, options?: UseQueryOptions<{ failed: boolean } | boolean>) {
  const key = useOrganizationKey({ key: ['upgrade'], organizationId: config.organizationId });
  return useQuery(key, () => config.checkUpgrade && config.checkUpgrade(config.organizationId), {
    enabled: config.checkUpgrade && !!config.organizationId,
    initialData: false,
    ...options,
  });
}
