import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  RequestChartIndexProps,
} from './interface';
import './index.less';

const RequestChartIndex = (props: RequestChartIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default RequestChartIndex;
