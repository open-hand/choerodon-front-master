import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { injectIntl } from 'react-intl';
import useStore from './useStore';
import ListDataSet from './ListDataSet';
import CategoryDataSet from './CategoryDataSet';

const Store = createContext();

export function useProjectsProStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(injectIntl(inject('AppState')((props) => {
  const {
    children,
    AppState,
    AppState: {
      currentMenuType: {
        type,
        id,
        organizationId,
      },
    },
    history,
  } = props;

  const ProjectsProUseStore = useStore(AppState, history);
  const categoryDs = useMemo(() => new DataSet(CategoryDataSet(AppState, history)), [type, id, organizationId]);
  const dataSet = useMemo(() => new DataSet(ListDataSet(AppState, history, categoryDs)), [type, id, organizationId]);

  const value = {
    ...props,
    intlPrefix: 'c7ncd.project',
    dataSet,
    ProjectsProUseStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
