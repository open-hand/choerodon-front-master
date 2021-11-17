import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  SideMenuIndexProps,
} from './interface';
import './index.less';

const SideMenuIndex = (props: SideMenuIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default SideMenuIndex;
