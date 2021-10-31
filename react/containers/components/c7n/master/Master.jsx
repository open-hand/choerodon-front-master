import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { initUiConfigure } from '@/common/initUiConfig';
import useTheme from '@/hooks/useTheme';
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
