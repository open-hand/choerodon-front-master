import React from 'react';
import { useInitUiConfig } from '@/configs';
import OutwardDefault from './OutwardDefault';

const InitUiConfigMaster = ({ AutoRouter }) => {
  useInitUiConfig();
  return (
    <OutwardDefault
      AutoRouter={AutoRouter}
    />
  );
};

export default InitUiConfigMaster;
