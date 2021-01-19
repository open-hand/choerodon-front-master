import React, { memo } from 'react';
import { StoreProvider } from './stores';
import StarTargetPro from './StarTargetPro';

const index = (props) => (
  <StoreProvider {...props}>
    <StarTargetPro />
  </StoreProvider>
);

export default memo(index);
