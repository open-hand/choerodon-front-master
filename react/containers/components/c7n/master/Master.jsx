import React, { useEffect } from 'react';
import { initUiConfigure } from '@/common/initUiConfig';
import { withRouter } from 'react-router';
import useTheme from '@/hooks/useTheme';
import MasterDefault from './MasterDefault';

const InitUiConfigMaster = ({ AutoRouter, location }) => {
  const [theme] = useTheme();
  useEffect(() => {
    initUiConfigure(theme);
  }, [theme]);

  return (
    <MasterDefault
      AutoRouter={AutoRouter}
    />
  );
};

export default withRouter(InitUiConfigMaster);
