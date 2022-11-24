import React from 'react';
import { get } from '@choerodon/inject';
import { StoreProvider } from '../../stores';
import WorkBench from './WorkBench';

const index = (props) => {
  const redirectWorkBench = get('configuration.master-global:redirectWorkBench');

  if (redirectWorkBench) {
    setTimeout(() => {
      window.location.replace(`${window.location.origin}/#${redirectWorkBench}`);
    }, 1000);
    return (
      <div />
    );
  }
  return (
    <StoreProvider {...props}>
      <WorkBench />
    </StoreProvider>
  );
};

export default index;
