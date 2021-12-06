import React, { useMemo } from 'react';
import { ModalProvider } from 'choerodon-ui/pro';
import { Container } from '@hzero-front-ui/core';
import { observer } from 'mobx-react-lite';
import { asyncRouter } from '@/hoc';
import { useC7NThemeInit } from '../themeConfigs';
import { useCurrentLanguage } from '@/hooks';

import useInitUiConfig from './useInitUiConfig';

const UIConfigInitContainer:React.FC = ({ children }) => {
  const language = useCurrentLanguage();

  const UILocaleProviderAsync = useMemo(() => asyncRouter(
    () => import('choerodon-ui/lib/locale-provider'),
    { locale: () => import(`choerodon-ui/lib/locale-provider/${language}.js`) },
  ), [language]);

  // 初始化UI默认配置
  useInitUiConfig();

  // 初始化注入新UI的版本
  useC7NThemeInit();

  return (
    <UILocaleProviderAsync>
      <ModalProvider location={window.location}>
        <Container>{children}</Container>
      </ModalProvider>
    </UILocaleProviderAsync>
  );
};

export default observer(UIConfigInitContainer);
