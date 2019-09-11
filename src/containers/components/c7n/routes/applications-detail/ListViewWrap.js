import React from 'react';
import PageWrap from '../../tools/tab-page/PageWrap';
import PageTab from '../../tools/tab-page/PageTab';
import Service from './views/service';
import Version from './views/version';

const App = () => (
  <PageWrap noHeader={['tab1']} cache>
    <PageTab title="应用服务" tabKey="tab1" component={Service} alwaysShow />
    <PageTab title="应用版本" tabKey="tab2" component={Version} alwaysShow />
  </PageWrap>
);

export default App;
