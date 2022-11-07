import { ModalProvider } from 'choerodon-ui/pro/lib';
import { TooltipProvider } from '@choerodon/components';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-nz';
import { C7NLocaleProviderTypes } from '../c7n-locale-provider';
import { ModalConsumer } from '../modal';
import { useCurrentLanguage } from '@/hooks';
import { asyncLocaleProvider } from '@/hoc';

interface SubServiceProviderProps<L extends Record<string, string>> {
  /**
   * 多语言配置
   */
  localeProviderConfig: Pick<C7NLocaleProviderTypes<L>, 'importer'>
}
/**
 * 子服务使用的Provider
 * @description 提供模态框 ModalProvider, 多语言注入Provider, Tooltip单例模式下使用的Provider
 * 日期(moment.js)多语言
 * ### 注意
 * - 后续分服务要有新的统一的添加内容 可在此进行配置
 *
 * @since 2.2.0
 * @example
 *
```tsx

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  NoMatch,
  SubServiceProvider,
} from '@choerodon/master';

function Index() {
  return (
    <SubServiceProvider
      localeProviderConfig={{
        // 这里的webpackInclude是限定webpack 编译寻找文件
        importer: (localeLanguage) => import(/* webpackInclude: /\index.(ts|js)$/ \*\/ `./locale/${localeLanguage}/index.js`),
      }}
      >
        <Switch>

          <Route path="*" component={NoMatch} />
        </Switch>
      </SubServiceProvider>
    );
  }

  export default Index;
 ```
 * @param props
 */
function SubServiceProvider<L extends Record<string, string>>({ children, localeProviderConfig }: React.PropsWithChildren<SubServiceProviderProps<L>>) {
  const location = useLocation();
  const language = useCurrentLanguage();
  useEffect(() => {
    const languageMap = {
      zh_CN: 'zh-cn',
      en_US: 'en-nz',
    } as const;
    moment.locale(languageMap[language]);
  }, [language]);

  const IntlProviderAsync = asyncLocaleProvider(language, () => localeProviderConfig.importer(language));

  return (
    <IntlProviderAsync>
      <ModalProvider location={location}>
        <ModalConsumer>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ModalConsumer>
      </ModalProvider>
    </IntlProviderAsync>
  );
}

export default SubServiceProvider;
