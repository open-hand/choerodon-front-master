import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import PipelineDataSet from './PipelineDataSet';

const Store = createContext();

export function usePipelineChartStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { projectId } },
  } = props;

  const pipelineDs = useMemo(() => new DataSet(PipelineDataSet({ projectId })), [projectId]);

  const value = {
    ...props,
    pipelineDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
