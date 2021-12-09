import React, { useCallback } from 'react';
import { LanguageTypes } from '@/typings';
import C7NLocaleProvider from '@/components/c7n-locale-provider';

const MasterLocaleContainer:React.FC = ({ children }) => {
  const handleImport = useCallback(
    (currentLanguage:LanguageTypes) => import(/* webpackInclude: /\index.(ts|js)$/ */ `../../locale/${currentLanguage}`),
    [],
  );

  return (
    <C7NLocaleProvider importer={handleImport}>
      {children}
    </C7NLocaleProvider>
  );
};

export default MasterLocaleContainer;
