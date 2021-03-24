import React, { useEffect } from 'react';
import { initUiConfigure } from '@/common/initUiConfig';
import MasterDefault from './MasterDefault';

const InitUiConfigMaster = ({ AutoRouter }) => {
  useEffect(() => {
    initUiConfigure();
  }, []);

  return (
    <MasterDefault
      AutoRouter={AutoRouter}
    />
  );
};

export default InitUiConfigMaster;
