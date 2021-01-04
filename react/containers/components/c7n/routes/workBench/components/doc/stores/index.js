import React, {
  createContext, useContext, useMemo, useEffect, useCallback,
} from 'react';
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
    selectedProjectId,
    cacheStore,
  } = useWorkBenchStore();

  const clsPrefix = 'c7n-workbench-doc';

  const {
    cacheDocData,
  } = cacheStore;

  const {
    getSelfDoc,
    rowNumber,
    setRowNumber,
  } = docStore;

  const resizeDom = useCallback((domTem) => {
    if (domTem) {
      const docH = get(domTem, 'offsetHeight');
      const docN = Math.floor(docH / 170);
      setRowNumber(docN || 2);
    }
  }, []);

  useEffect(() => {
    const domTem = document.querySelector('.c7n-workbench-doc-content');
    new ResizeObserver((entries) => {
      const dom = get(entries[0], 'target');
      resizeDom(dom);
    }).observe(domTem);
  }, []);

  const docDs = useMemo(() => new DataSet(DocDataSet({
    organizationId, selectedProjectId, self: getSelfDoc, docStore, cacheStore, rowNumber,
  })), [getSelfDoc, organizationId, rowNumber, selectedProjectId]);

  const opts = useMemo(() => [{ value: false, text: '项目' }, { value: true, text: '个人' }], []);

  useEffect(() => {
    const mainData = cacheDocData;
    const tempArr = get(mainData, 'content');
    if (getSelfDoc !== get(mainData, 'isSelf') || selectedProjectId !== get(mainData, 'selectedProjectId')) {
      docDs.query();
      return;
    }
    if (tempArr && get(tempArr, 'length')) {
      docStore.setListHasMore(
        mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
      );
      docDs.loadData(tempArr);
    }
  }, [cacheDocData, docDs]);

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
