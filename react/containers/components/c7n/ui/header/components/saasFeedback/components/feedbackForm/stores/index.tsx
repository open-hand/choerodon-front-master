import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import feedbackFormDataSet from './feedbackFormDataSet';
import useStore, { MainStoreProps } from './useStore';

interface ContextProps {
  intlPrefix: string,
  prefixCls: string
  intl: { formatMessage(arg0: object, arg1?: object): string },
  issueType: {
    value:string,
    name:string
  }[],
  feedbackFormDs:DataSet
  formStore: MainStoreProps,
  organizationId:string,
  emergencyDs:DataSet,
}

const Store = createContext({} as ContextProps);

export function useSaaSFeedbackFormStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    intl: { formatMessage },
    AppState: { currentMenuType: { id, organizationId } },
  } = props;

  const issueType = useMemo(() => ([
    'advisory',
    'defect',
    'demand',
  ]), []);

  const feedbackFormDs = useMemo(() => new DataSet(feedbackFormDataSet()), []);

  const formStore = useStore();

  const value = {
    ...props,
    prefixCls: 'c7ncd-saas-feedbackForm',
    issueType,
    feedbackFormDs,
    formStore,
    organizationId,
    // emergencyDs,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
