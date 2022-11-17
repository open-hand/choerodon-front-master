import React from 'react';
import { get } from '@choerodon/inject';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  HeaderIndexProps,
} from './interface';
import './index.less';

const HeaderIndex = (props: any) => {
  const {
    appState,
  } = props;
  const defaultResult = (
    <StoreProvider {...props}>
      <Content />
    </StoreProvider>
  );

  if (get('configuration.master-global:header')) {
    const {
      display,
      customHeader,
    } = get('configuration.master-global:header');
    if (display) {
      return customHeader ? customHeader(appState) : defaultResult;
    }
    return null;
  }
  return defaultResult;
};

export default HeaderIndex;
