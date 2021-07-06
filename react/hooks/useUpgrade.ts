// @ts-nocheck
import { useQuery, UseQueryOptions } from 'react-query';
import useOrganizationKey from './useOrganizationKey';
import axios from '../containers/components/c7n/tools/axios';

export interface UpgradeConfig {
  organizationId: string
}

export default function useUpgrade(config: UpgradeConfig, options?: UseQueryOptions<{ failed: boolean } | boolean>) {
  const key = useOrganizationKey({ key: ['upgrade'], organizationId: config.organizationId });
  return useQuery(key, () => axios({
    url: '/iam/choerodon/v1/register_saas/check_upgrade',
    method: 'get',
    params: { tenantId: config.organizationId },
  }), {
    enabled: !!config.organizationId,
    initialData: false,
    select: (res) => {
      try {
        if (res && res.failed) {
          return false;
        }
        if (res.status === 204) {
          return false;
        }
        return !!res;
      } catch (e) {
        return false;
      }
    },
    ...options,
  });
}
