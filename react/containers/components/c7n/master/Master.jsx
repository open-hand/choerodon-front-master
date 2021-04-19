import React, { useEffect } from 'react';
import { initUiConfigure } from '@/common/initUiConfig';
import { withRouter } from 'react-router';
import MasterDefault from './MasterDefault';

const InitUiConfigMaster = ({ AutoRouter, location }) => {
  useEffect(() => {
    initUiConfigure();
  }, []);

  return (
    <MasterDefault
      AutoRouter={AutoRouter}
    />
  );
};

export default withRouter(InitUiConfigMaster);
