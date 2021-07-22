import React, { useMemo, createContext, useContext } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';

import AppState from '@/containers/stores/c7n/AppState';

interface ContextProps {
  clusterDataSet:DataSet,
  hostDataSet:DataSet
}

const Store = createContext<ContextProps>({} as ContextProps);

export default function useStore() {
  return useContext(Store);
}

export function StoreProvider({ children }:{children:React.ReactNode}) {
  const clusterDataSet = useMemo(() => (
    new DataSet({
      paging: false,
      autoQuery: true,
      selection: false,
      transport: {
        read: () => ({
          url: `devops/v1/organizations/${AppState.currentMenuType?.organizationId}/resource/cluster`,
          method: 'get',
        }),
      },
      fields: [
        { name: 'name', label: '主机名' },
        { name: 'status', label: '运行状态' },
        { name: 'creationDate', label: '创建时间' },
      ],
    })
  ), []);

  const hostDataSet = useMemo(() => (
    new DataSet({
      selection: false,
      autoQuery: true,
      transport: {
        read: () => ({
          url: `devops/v1/organizations/${AppState.currentMenuType?.organizationId}/resource/host`,
          method: 'get',
        }),
      },
      paging: false,
      fields: [
        { name: 'name', label: '主机名' },
        { name: 'serviceName' },
        // { name: 'resourcePool', label: '资源池' },
        { name: 'cpu', label: 'CPU使用率', type: FieldType.number },
        { name: 'mem', label: '内存使用率', type: FieldType.number },
        { name: 'disk', label: '磁盘使用率', type: FieldType.number },
        { name: 'hostIp', label: 'IP地址' },
        { name: 'sshPort' },
        { name: 'hostStatus', label: '运行状态' },
      ],
    })
  ), []);

  const value = {
    clusterDataSet,
    hostDataSet,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}
