import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  ProjectsSelectorIndexProps,
} from './interface';
import './index.less';

const ProjectsSelectorIndex = (props: ProjectsSelectorIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default ProjectsSelectorIndex;
