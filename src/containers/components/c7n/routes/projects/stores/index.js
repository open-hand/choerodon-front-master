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
    const { AppState: { currentMenuType: { type, id } }, intl, children } = props;
    const [showType, setShowType] = useState('table');
    const dataSet = useMemo(() => new DataSet(ListDataSet({ type, id, intl })), [type, id]);
    const value = {
      ...props,
      prefixCls: 'c7n-projects',
      // intlPrefix: 'c7n-projects',
      dataSet,
      toggleShowType(st) {
        setShowType(st);
      },
      showType,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
)));
