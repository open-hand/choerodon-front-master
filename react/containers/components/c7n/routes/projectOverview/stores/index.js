import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import DelayTaskDataSet from './DelayTaskDataSet';
import useStore from './useStore';
const Store = createContext();

export function useProjectOverviewStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId } },
    history,
  } = props;
  console.log(props)
  const delayTaskDataSet = useMemo(() => new DataSet(DelayTaskDataSet({ organizationId })), [organizationId]);
  const projectOverviewStore = useStore(projectId);
  useEffect(() => {
    projectOverviewStore.loadAllSprint().then(
      sprints => {
        projectOverviewStore.setSprints(sprints);
        const staredSprint = sprints.find(sprint => sprint.statusCode === 'started');
        console.log('s', staredSprint);
        projectOverviewStore.setStaredSprint(staredSprint);
      }
    )
  }, []);

  const value = {
    ...props,
    delayTaskDataSet,
    projectOverviewStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
