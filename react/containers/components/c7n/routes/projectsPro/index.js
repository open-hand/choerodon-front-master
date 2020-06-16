import React from 'react';
import { StoreProvider } from "./stores";
import ProjectsPro from './ProjectsPro';

const index = (props) => (
  <StoreProvider {...props}>
    <ProjectsPro />
  </StoreProvider>
)

export default index
