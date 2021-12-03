import React, { useMemo } from 'react';
import { ModalProvider } from 'choerodon-ui/pro';
import { Container } from '@hzero-front-ui/core';
import { observer } from 'mobx-react-lite';
import { asyncRouter } from '@/hoc';
import { useC7NThemeInit } from '../themeConfigs';
import { useCurrentLanguage } from '@/hooks';

import useInitUiConfig from './useInitUiConfig';
import C7NLocaleProvider from '@/components/c7n-locale-provider';
import { LanguageTypes } from '@/typings';

const UIConfigInitContainer:React.FC = ({ children }) => {
  const language = useCurrentLanguage();

  const UILocaleProviderAsync = useMemo(() => asyncRouter(
    () => import('choerodon-ui/lib/locale-provider'),
    { locale: () => import(`choerodon-ui/lib/locale-provider/${language}.js`) },
  ), [language]);

  const handleImport = (currentLanguage:LanguageTypes) => import(/* webpackInclude: /\index.(ts|js)$/ */ `../../locale/${currentLanguage}`);

  console.info('current language:', language);

  // 初始化UI默认配置
  useInitUiConfig();
  // 初始化注入新UI的版本
  useC7NThemeInit();

  return (
    <UILocaleProviderAsync>
      <C7NLocaleProvider importer={handleImport}>
        <ModalProvider location={window.location}>
          <Container>{children}</Container>
        </ModalProvider>
      </C7NLocaleProvider>
    </UILocaleProviderAsync>
  );
};

export default observer(UIConfigInitContainer);
