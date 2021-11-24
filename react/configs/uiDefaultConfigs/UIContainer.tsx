import React, { useMemo } from 'react';
import { ModalProvider } from 'choerodon-ui/pro';
import { Container } from '@hzero-front-ui/core';
import { observer } from 'mobx-react-lite';
import { useLocalStorageState } from 'ahooks';
import AppState from '@/containers/stores/c7n/AppState';
import { asyncRouter, asyncLocaleProvider } from '@/hoc';
import useInitUiConfig from './useInitUiConfig';
import { useC7NThemeInit } from '../themeConfigs';
import { LanguageTypes } from '@/typings';

const UIConfigInitContainer:React.FC = ({ children }) => {
  const [localLanguage] = useLocalStorageState('language');
  const language = localLanguage || AppState.currentLanguage as LanguageTypes;

  const UILocaleProviderAsync = useMemo(() => asyncRouter(
    () => import('choerodon-ui/lib/locale-provider'),
    { locale: () => import(`choerodon-ui/lib/locale-provider/${language}.js`) },
  ), [language]);

  const IntlProviderAsync = useMemo(() => asyncLocaleProvider(language,
    () => import(`../../locale/${language}`)), [language]);

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

export default observer(UIConfigInitContainer);
