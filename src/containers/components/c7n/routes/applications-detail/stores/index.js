import React, { createContext, useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import ServiceDataSet from './ServiceDataSet';
import VersionDataSet from './VersionDataSet';

const Store = createContext();

export default Store;

export const StoreProvider = withRouter(injectIntl(inject('AppState', 'HeaderStore', 'MenuStore')(
  (props) => {
    const { AppState: { currentMenuType: { type, id, orgId } }, intl, children, AppState, history } = props;
    const applicationId = props.match.params.id;
    const proId = props.match.params.projectId;
    const [showType, setShowType] = useState('table');
    const [isNotRecent, setIsNotRecent] = useState(false);
    const serviceDs = useMemo(() => new DataSet(ServiceDataSet(AppState, history, applicationId)), [type, id, orgId, applicationId]);
    const versionDs = useMemo(() => new DataSet(VersionDataSet(AppState, history, applicationId, proId)), [type, id, orgId, applicationId, proId]);
    const value = {
      ...props,
      prefixCls: 'c7n-applications',
      // intlPrefix: 'c7n-projects',
      serviceDs,
      versionDs,
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
