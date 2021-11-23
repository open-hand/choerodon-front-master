import React from 'react';
import { ModalProvider } from 'choerodon-ui/pro';
import { Container } from '@hzero-front-ui/core';
import AppState from '@/containers/stores/c7n/AppState';
import { asyncRouter, asyncLocaleProvider } from '@/hoc';
import useInitUiConfig from './useInitUiConfig';
import { useC7NThemeInit } from '../themeConfigs';
import { LanguageTypes } from '@/typings';

// @ts-expect-error
const storeLang:LanguageTypes = localStorage.getItem('language') && JSON.parse(localStorage.getItem('language'));

const language = storeLang || AppState.currentLanguage as LanguageTypes;

const UILocaleProviderAsync = asyncRouter(
  () => import('choerodon-ui/lib/locale-provider'),
  { locale: () => import(`choerodon-ui/lib/locale-provider/${language}.js`) },
);

const IntlProviderAsync = asyncLocaleProvider(language,
  () => import(`../../locale/${language}`));

const UIConfigInitContainer:React.FC = ({ children }) => {
  console.info('current language:', language);

  // 初始化UI默认配置
  useInitUiConfig();
  // 初始化注入新UI的版本
  useC7NThemeInit();
  return (
    <UILocaleProviderAsync>
      <IntlProviderAsync>
        <ModalProvider location={window.location}>
          <Container>{children}</Container>
        </ModalProvider>
      </IntlProviderAsync>
    </UILocaleProviderAsync>
  );
};

export default UIConfigInitContainer;
