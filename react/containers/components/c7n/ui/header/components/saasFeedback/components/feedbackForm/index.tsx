import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import './index.less';

const Index = (props: any) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default Index;
