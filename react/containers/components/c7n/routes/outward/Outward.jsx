import React, { useEffect } from 'react';
import { initUiConfigure } from '@/common/initUiConfig';
import useTheme from '@/hooks/useTheme';
import OutwardDefault from './OutwardDefault';

const InitUiConfigMaster = ({ AutoRouter }) => {
  const [theme] = useTheme();
  useEffect(() => {
    initUiConfigure(theme);
  }, [theme]);

  return (
    <OutwardDefault
      AutoRouter={AutoRouter}
    />
  );
};

export default InitUiConfigMaster;
