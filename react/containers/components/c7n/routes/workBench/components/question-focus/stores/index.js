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
import useStore from './useStore';

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

  const questionStore = useStore();
  const selectedProjectId = useMemo(() => get(workBenchUseStore.getActiveStarProject, 'id'), [workBenchUseStore.getActiveStarProject]);

  const questionDs = useMemo(() => new DataSet(QuestionDataSet({ organizationId, questionStore })), [organizationId]);

  useEffect(() => {
    questionDs.setQueryParameter('selectedProjectId', selectedProjectId);
    questionDs.query();
  }, [selectedProjectId]);

  const value = {
    ...props,
    prefixCls: 'c7ncd-workbench-question-focus',
    questionDs,
    organizationId,
    workBenchUseStore,
    questionStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
