import { useQuery, UseQueryOptions } from 'react-query';

export interface UpgradeConfig {
  organizationId: string
  checkUpgrade: undefined | ((organizationId:string)=> Promise<any>)
  key: string
}

export default function useUpgrade(config: UpgradeConfig, options?: UseQueryOptions<{ failed: boolean } | boolean>) {
  const { key } = config;
  // @ts-ignore
  return useQuery(key, () => config.checkUpgrade(config.organizationId), {
    enabled: config.checkUpgrade && !!config.organizationId,
    initialData: false,
    ...options,
  });
}
