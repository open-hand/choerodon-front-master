import React from 'react';
import 'moment/locale/zh-cn';
import moment from 'moment';
import { StoreProvider } from './stores';
import ProjectsPro from './ProjectsPro';

moment.locale('zh-cn');
const index = (props) => (
  <StoreProvider {...props}>
    <ProjectsPro />
  </StoreProvider>
);

export default index;
