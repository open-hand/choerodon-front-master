import { useQuery, UseQueryOptions } from 'react-query';
import { get as getInject } from '@choerodon/inject';
import useOrganizationKey from './useOrganizationKey';

export interface UpgradeConfig {
  organizationId: string
}

const checkUpgrade = (organizationId: string) => {
  if (getInject('base-pro:checkUpgrade')) {
    return getInject('base-pro:checkUpgrade')(organizationId);
  }
  return false;
};

export default function useUpgrade(config: UpgradeConfig, options?: UseQueryOptions<{ failed: boolean } | boolean>) {
  const key = useOrganizationKey({ key: ['upgrade'], organizationId: config.organizationId });
  return useQuery(key, () => checkUpgrade(config.organizationId), {
    enabled: !!config.organizationId,
    initialData: false,
    ...options,
  });
}
