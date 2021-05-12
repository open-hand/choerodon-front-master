import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import feedbackFormDataSet from './feedbackFormDataSet';
// import useStore, { MainStoreProps } from './useStore';

interface ContextProps {
  intlPrefix: string,
  prefixCls: string
  intl: { formatMessage(arg0: object, arg1?: object): string },
  issueType: {
    value:string,
    name:string
  }[],
  feedbackFormDs:DataSet
}

const Store = createContext({} as ContextProps);

export function useSaaSFeedbackFormStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    intl: { formatMessage },
  } = props;

  const issueType = useMemo(() => ([
    {
      value: 'talk',
      name: '问题咨询',
    },
    {
      value: 'dis',
      name: '缺陷提报',
    },
    {
      value: 'demand',
      name: '需求提报',
    },
  ]), []);

  const feedbackFormDs = useMemo(() => new DataSet(feedbackFormDataSet()), []);

  const value = {
    ...props,
    prefixCls: 'c7ncd-saas-feedbackForm',
    issueType,
    feedbackFormDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
