import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  HomePageIndexProps,
} from './interface';
import './index.less';

const HomePageIndex = (props: HomePageIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default HomePageIndex;
