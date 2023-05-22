import React from 'react';
import { get } from '@choerodon/inject';
import { Loading } from '@zknow/components';
import { StoreProvider } from '../../stores';
import WorkBench from './WorkBench';
import useExternalFunc from '@/hooks/useExternalFunc';

const Index = (props) => {
  const redirectWorkBench = get('configuration.master-global:redirectWorkBench');
  const { loading, func: useDetail } = useExternalFunc('agile', 'agile:useDetail');

  if (redirectWorkBench) {
    setTimeout(() => {
      window.location.replace(`${window.location.origin}/#${redirectWorkBench}`);
    }, 1000);
    return (
      <div />
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <StoreProvider {...props} useDetail={useDetail?.default}>
      <WorkBench />
    </StoreProvider>
  );
};

export default Index;
