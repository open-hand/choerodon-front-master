import React from 'react';
import { StoreProvider } from './stores';
import ListView from './ListView';
import FeedBack from '../../tools/feedback';

const Index = props => (
  <StoreProvider {...props}>
    <ListView />
  </StoreProvider>
);

export default FeedBack(Index);
