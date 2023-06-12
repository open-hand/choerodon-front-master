import React from 'react';
import { StoreProvider } from './Stores';
import Content from './Content';

export interface IProps {

}

const ProjectQualityScore: React.FC<IProps> = (props) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default ProjectQualityScore;
