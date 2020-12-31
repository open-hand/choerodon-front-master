import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { injectIntl } from 'react-intl';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import useStore from './useStore';
import DocDataSet from './DocDataSet';

import { useWorkBenchStore } from '../../../stores';

const Store = createContext();

export function useDoc() {
  return useContext(Store);
}

export const StoreProvider = withRouter(injectIntl(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
    history,
  } = props;

  const docStore = useStore();

  const {
    workBenchUseStore,
  } = useWorkBenchStore();

  const clsPrefix = 'c7n-workbench-doc';

  const {
    getSelfDoc,
  } = docStore;

  const selectedProjectId = get(workBenchUseStore.getActiveStarProject, 'id');

  const docDs = useMemo(() => new DataSet(DocDataSet({ organizationId, selectedProjectId, self: getSelfDoc })), [getSelfDoc, organizationId, selectedProjectId]);

  const opts = useMemo(() => [{ value: false, text: '项目' }, { value: true, text: '个人' }], []);

  const value = {
    docStore,
    organizationId,
    docDs,
    history,
    clsPrefix,
    opts,
    ...props,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}))));
