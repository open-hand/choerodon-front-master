import React, {
  createContext, useContext, useMemo, useEffect, useState,
} from 'react';
import { inject } from 'mobx-react';
import { remove } from 'mobx';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { get } from 'lodash';
import { usePersistFn } from 'ahooks';
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
  const handleRemoveCache = usePersistFn((key = undefined) => {
    key ? remove(focusQuestions, key) : cacheStore.setFocusQuestions({});
  });
  const questionStore = useStore(focusQuestions, organizationId, handleRemoveCache);

  const {
    tabKey, noticeRefreshValue,
  } = questionStore;

  const questionDs = useMemo(() => {
    questionStore.init();
    return new DataSet(QuestionDataSet({
      organizationId, type: tabKey, questionStore, selectedProjectId, cacheStore,
    }));
  }, [organizationId, selectedProjectId, tabKey]);

  useEffect(() => {
    const mainData = focusQuestions;
    const tempArr = get(mainData, 'content');
    const currentId = get(mainData, 'selectedProjectId');
    const tempType = get(mainData, 'type');
    const preOrganizationId = get(mainData, 'organizationId');
    if (preOrganizationId !== organizationId) {
      questionDs.query();
      return;
    }
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
  }, [questionDs, noticeRefreshValue]);

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
