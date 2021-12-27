import React, { useEffect, useMemo } from 'react';
import { ModalProvider, localeContext } from 'choerodon-ui/pro';
import { Container } from '@hzero-front-ui/core';
import { observer } from 'mobx-react-lite';
import zhCN from 'choerodon-ui/pro/lib/locale-context/zh_CN';
import enUS from 'choerodon-ui/pro/lib/locale-context/en_US';
import { useC7NThemeInit } from '../themeConfigs';
import { useCurrentLanguage } from '@/hooks';
import { LanguageTypes } from '@/typings';

import useInitUiConfig from './useInitUiConfig';

const UIConfigInitContainer:React.FC = ({ children }) => {
  const language = useCurrentLanguage();

  const localeObj:Record<LanguageTypes, any> = useMemo(() => ({
    zh_CN: zhCN,
    en_US: enUS,
  }), []);

  // 初始化UI默认配置
  useInitUiConfig();

  // 初始化注入新UI的版本
  useC7NThemeInit();

  useEffect(() => {
    localeContext.setLocale(localeObj[language]);
  }, [language]);

  return (
    <Container>
      <ModalProvider location={window.location}>
        {children}
      </ModalProvider>
    </Container>
  );
};

export default observer(UIConfigInitContainer);
