import React, { createContext, useMemo, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import ListDataSet from './ListDataSet';
import InRowDataSet from './InRowDataSet';

const Store = createContext();

export default Store;

export const StoreProvider = withRouter(injectIntl(inject('AppState', 'HeaderStore', 'MenuStore')(
  (props) => {
    const { AppState: { currentMenuType: { id, orgId } }, children, AppState, history } = props;
    const [type, changeType] = useState('join');
    const dataSet = useMemo(() => new DataSet(ListDataSet(AppState, history)), [id, orgId]);
    const dsMap = useRef({});
    const value = {
      ...props,
      prefixCls: 'c7n-applicatios',
      dataSet,
      type,
      changeType,
      getDs(key) {
        if (!dsMap.current[key]) {
          dsMap.current[key] = new DataSet(InRowDataSet(key, history));
        }
        return dsMap.current[key];
      },
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
)));
