import React, {
  createContext, useContext, useMemo, useEffect, useState,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { get } from 'lodash';
import { useWorkBenchStore } from '../../../stores';
import QuestionDataSet from './QuestionDataSet';

const Store = createContext();

export function useTodoQuestionStore() {
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

  const questionDs = useMemo(() => new DataSet(QuestionDataSet({ selectedProjectId, organizationId })), [selectedProjectId, organizationId]);


  const value = {
    ...props,
    questionDs,
    organizationId,
    history,
    workBenchUseStore
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
