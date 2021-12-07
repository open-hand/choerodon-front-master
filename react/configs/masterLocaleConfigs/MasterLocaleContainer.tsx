import React from 'react';
import { useCurrentLanguage } from '@/hooks';
import { LanguageTypes } from '@/typings';
import C7NLocaleProvider from '@/components/c7n-locale-provider';

const MasterLocaleContainer:React.FC = ({ children }) => {
  const language = useCurrentLanguage();

  const handleImport = (currentLanguage:LanguageTypes) => import(/* webpackInclude: /\index.(ts|js)$/ */ `../../locale/${currentLanguage}`);

  console.info('current language:', language);

  return (
    <C7NLocaleProvider importer={handleImport}>
      {children}
    </C7NLocaleProvider>
  );
};

export default MasterLocaleContainer;
