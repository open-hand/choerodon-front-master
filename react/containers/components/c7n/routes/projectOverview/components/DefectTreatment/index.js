import React from 'react';
import { StoreProvider } from './stores';
import DefectTreatment from './DefectTreatment';

const index = (props) => (
  <StoreProvider {...props}>
    <DefectTreatment />
  </StoreProvider>
);

export default index;
