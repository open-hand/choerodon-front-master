import React, { useEffect } from 'react';
import { initUiConfigure } from '@/common/initUiConfig';
import OutwardDefault from './OutwardDefault';

const InitUiConfigMaster = ({ AutoRouter }) => {
  useEffect(() => {
    initUiConfigure();
  }, []);

  return (
    <OutwardDefault
      AutoRouter={AutoRouter}
    />
  );
};

export default InitUiConfigMaster;
