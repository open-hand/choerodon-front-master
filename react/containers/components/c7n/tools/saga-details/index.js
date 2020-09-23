import React from 'react';
import PropTypes from 'prop-types';
import { StoreProvider } from './stores';
import Content from './Content';

import './index.less';

const Index = (props) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

Index.propTypes = {
  instance: PropTypes.bool.isRequired,
  sagaInstanceId: PropTypes.string.isRequired,
};

export default Index;
