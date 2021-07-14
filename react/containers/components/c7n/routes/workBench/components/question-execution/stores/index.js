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
    myExecutionQuestions,
  } = cacheStore;

  const questionStore = useStore();

  const questionDs = useMemo(() => {
    // 重新创建ds时初始化store
    questionStore.init();
    return new DataSet(QuestionDataSet({
      organizationId, questionStore, selectedProjectId, cacheStore,
    }));
  }, [cacheStore, organizationId, questionStore, selectedProjectId]);

  useEffect(() => {
    const mainData = myExecutionQuestions;
    const tempArr = get(mainData, 'content');
    const currentId = get(mainData, 'selectedProjectId');
    const searchDataId = get(mainData, 'searchDataId');
    const searchData = get(mainData, 'searchData');
    if (selectedProjectId !== currentId) {
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
