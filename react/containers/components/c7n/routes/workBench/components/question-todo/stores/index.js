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
    selectedProjectId,
    cacheStore,
  } = useWorkBenchStore();

  const {
    todoQuestions,
  } = cacheStore;

  const questionStore = useStore();

  const questionDs = useMemo(() => {
    questionStore.init();

    return new DataSet(QuestionDataSet({
      organizationId, questionStore, selectedProjectId, cacheStore,
    }));
  }, [organizationId, selectedProjectId]);

  useEffect(() => {
    const mainData = todoQuestions;
    const tempArr = get(mainData, 'content');
    const currentId = get(mainData, 'selectedProjectId');
    const searchDataId = get(mainData, 'searchDataId');
    const searchData = get(mainData, 'searchData');
    console.log('searchDataId......', searchDataId, selectedProjectId, currentId);
    if (selectedProjectId !== currentId) {
      console.log('if....give up');
      searchDataId || questionDs.query();
      return;
    }
    if (tempArr) {
      searchDataId && questionDs.setQueryParameter('searchDataId', searchDataId);
      searchDataId && questionDs.setQueryParameter('searchData', searchData);

      questionDs.loadData(tempArr);
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
    prefixCls: 'c7ncd-workbench-question-todo',
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
