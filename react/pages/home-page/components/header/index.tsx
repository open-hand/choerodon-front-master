import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  HeaderIndexProps,
} from './interface';
import './index.less';

const HeaderIndex = (props: HeaderIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default HeaderIndex;
