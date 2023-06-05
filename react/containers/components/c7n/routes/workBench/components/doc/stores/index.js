import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { injectIntl } from 'react-intl';
import { debounce, get } from 'lodash';
import { withRouter } from 'react-router-dom';
import useStore from './useStore';
import DocDataSet from './DocDataSet';

import { useWorkBenchStore } from '../../../stores';

let resizeObserver;

const Store = createContext();

export function useDoc() {
  return useContext(Store);
}

export const StoreProvider = withRouter(injectIntl(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId }, currentServices },
    history,
  } = props;

  const hasKnowledgeService = currentServices.some((i) => i?.serviceCode === 'knowledgebase-service');

  const docStore = useStore();

  const {
    selectedProjectId,
    cacheStore,
    formatCommon,
  } = useWorkBenchStore();

  const clsPrefix = 'c7n-workbench-doc';

  const {
    cacheDocData,
  } = cacheStore;

  const {
    getSelfDoc,
  } = docStore;

  const docDs = useMemo(() => new DataSet(DocDataSet({
    organizationId, selectedProjectId, self: getSelfDoc, docStore, cacheStore, hasKnowledgeService,
  })), [getSelfDoc, organizationId, selectedProjectId, hasKnowledgeService]);

  const opts = useMemo(() => [{ value: false, text: formatCommon({ id: 'project' }) }, { value: true, text: formatCommon({ id: 'personal' }) }], []);

  useEffect(() => {
    const mainData = cacheDocData;
    const tempArr = get(mainData, 'content');
    const isSelf = get(mainData, 'isSelf');
    const preOrganizationId = get(mainData, 'organizationId');
    if (preOrganizationId !== organizationId) {
      docDs.query();
      return;
    }
    if (getSelfDoc !== isSelf || selectedProjectId !== get(mainData, 'selectedProjectId')) {
      docDs.query();
      return;
    }
    if (tempArr) {
      docStore.setListHasMore(
        mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
      );
      docDs.loadData(tempArr);
    } else {
      docDs.query();
    }
  }, [docDs]);

  useEffect(() => function () {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  }, []);

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
