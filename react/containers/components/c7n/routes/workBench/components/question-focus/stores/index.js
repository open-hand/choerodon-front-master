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
  } = props;

  const {
    workBenchUseStore,
    cacheStore,
    selectedProjectId,
  } = useWorkBenchStore();

  const {
    focusQuestions,
  } = cacheStore;

  const questionStore = useStore(focusQuestions);

  const {
    tabKey,
  } = questionStore;

  const questionDs = useMemo(() => new DataSet(QuestionDataSet({
    organizationId, type: tabKey, questionStore, selectedProjectId, cacheStore,
  })), [organizationId, selectedProjectId, tabKey]);

  useEffect(() => {
    const mainData = focusQuestions;
    const tempArr = get(mainData, 'content');
    const currentId = get(mainData, 'selectedProjectId');
    const tempType = get(mainData, 'type');
    if (selectedProjectId !== currentId || tempType !== tabKey) {
      questionDs.query();
      return;
    }
    if (tempArr) {
      questionDs.loadData(tempArr, tempArr.length);
      questionStore.setHasMore(
        mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
      );
      questionStore.setTotalCount(mainData.totalElements);
    } else {
      questionDs.query();
    }
  }, [questionDs]);

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
