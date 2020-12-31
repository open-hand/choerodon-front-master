import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { get } from 'lodash';
import AppServiceDataSet from './AppServiceDataSet';
import { useWorkBenchStore } from '../../../stores';

const Store = createContext();

export function useRecentAppStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
    history,
  } = props;

  const {
    workBenchUseStore,
  } = useWorkBenchStore();

  const selectedProjectId = get(workBenchUseStore.getActiveStarProject, 'id');
  const category = get(workBenchUseStore.getActiveStarProject, 'category');

  const url = !selectedProjectId ? `devops/v1/organizations/${organizationId}/work_bench/latest_app_service` : `devops/v1/organizations/${organizationId}/work_bench/latest_app_service?project_id=${selectedProjectId}`;

  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ url })), [url]);

  const goAppService = (record) => {
    const { projectId, projectName, id } = record.toData() || {};
    const search = `?id=${projectId}&name=${encodeURIComponent(projectName)}&organizationId=${organizationId}&type=project`;
    history.push({
      pathname: '/devops/code-management',
      search,
      state: {
        appServiceId: id,
      },
    });
  };

  const value = {
    ...props,
    appServiceDs,
    organizationId,
    history,
    selectedProjectId,
    category,
    goAppService,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
