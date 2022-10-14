import { ModalProvider } from 'choerodon-ui/pro/lib';
import { TooltipProvider } from '@choerodon/components';
import React from 'react';
import { useLocation } from 'react-router';
import C7NLocaleProvider, { C7NLocaleProviderTypes } from '../c7n-locale-provider';
import { ModalConsumer } from '../modal';
import { COMPONENT_DEFAULT_PROPS } from '@/constants';

interface SubServiceProviderProps<L extends Record<string, string>> {
  /**
   * 多语言配置
   */
  localeProviderConfig: Pick<C7NLocaleProviderTypes<L>, 'importer'>
}
/**
 * 子服务使用的Provider
 * 提供模态框 ModalProvider, 多语言注入Provider, Tooltip单例模式下使用的Provider
 * @example
 * ```tsx

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
 * ```
 * @param props
 */
function SubServiceProvider<L extends Record<string, string>>({ children, localeProviderConfig }: React.PropsWithChildren<SubServiceProviderProps<L>>) {
  const location = useLocation();
  return (
    <C7NLocaleProvider {...localeProviderConfig}>
      <ModalProvider location={location}>
        <ModalConsumer>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ModalConsumer>
      </ModalProvider>
    </C7NLocaleProvider>
  );
}

SubServiceProvider.defaultProps = COMPONENT_DEFAULT_PROPS;
export default SubServiceProvider;
