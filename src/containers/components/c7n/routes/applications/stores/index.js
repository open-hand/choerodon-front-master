import React, { createContext, useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import ListDataSet from './ListDataSet';

const Store = createContext();

export default Store;

export const StoreProvider = withRouter(injectIntl(inject('AppState', 'HeaderStore', 'MenuStore')(
  (props) => {
    const { AppState: { currentMenuType: { type, id, orgId } }, intl, children, AppState, history } = props;
    const [showType, setShowType] = useState('table');
    const [isNotRecent, setIsNotRecent] = useState(false);
    const dataSet = useMemo(() => new DataSet(ListDataSet(AppState, history)), [type, id, orgId]);
    const value = {
      ...props,
      prefixCls: 'c7n-projects',
      // intlPrefix: 'c7n-projects',
      dataSet,
      toggleShowType(st) {
        setShowType(st);
      },
      toggleRecent(inr) {
        setIsNotRecent(inr);
      },
      showType,
      isNotRecent,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
)));
