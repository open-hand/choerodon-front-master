import React from 'react';
import { get } from '@choerodon/inject';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  HeaderIndexProps,
} from './interface';
import './index.less';

const HeaderIndex = (props: HeaderIndexProps) => {
  const defaultResult = (
    <StoreProvider {...props}>
      <Content />
    </StoreProvider>
  );

  if (get('configuration.master-global:header')) {
    const {
      display,
    } = get('configuration.master-global:header');
    if (display) {
      return defaultResult;
    }
    return null;
  }
  return defaultResult;
};

export default HeaderIndex;
