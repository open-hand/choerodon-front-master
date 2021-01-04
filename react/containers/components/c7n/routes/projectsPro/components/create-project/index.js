import React from 'react';
import 'moment/locale/zh-cn';
import moment from 'moment';
import { StoreProvider } from './stores';
import Content from './Content';

moment.locale('zh-cn');
const index = (props) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default index;
