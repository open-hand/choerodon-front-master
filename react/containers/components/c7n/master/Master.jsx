import React from 'react';
import { withRouter } from 'react-router';
import { useInitUiConfig } from '@/configs';
import MasterDefault from './MasterDefault';

const InitUiConfigMaster = ({ AutoRouter }) => {
  useInitUiConfig();

  return (
    <MasterDefault
      AutoRouter={AutoRouter}
    />
  );
};

export default withRouter(InitUiConfigMaster);
