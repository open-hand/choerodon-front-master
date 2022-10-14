import { ModalProvider } from 'choerodon-ui/pro/lib';
import { TooltipProvider } from '@choerodon/components';
import React from 'react';
import { useLocation } from 'react-router';
import C7NLocaleProvider, { C7NLocaleProviderTypes } from '../c7n-locale-provider';
import { ModalConsumer } from '../modal';
import { COMPONENT_DEFAULT_PROPS } from '@/constants';

interface SubServiceProviderProps<L extends Record<string, string>> {
    localeProviderConfig: C7NLocaleProviderTypes<L>
}
/**
 * 子服务使用的Provider
 * 提供模态框 ModalProvider, 多语言注入Provider, Tooltip单例模式下使用的Provider
 * @param props
 */

const SubServiceProvider = <L extends Record<string, string>>({ children, localeProviderConfig }: React.PropsWithChildren<SubServiceProviderProps<L>>) => {
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
};
SubServiceProvider.defaultProps = COMPONENT_DEFAULT_PROPS;
export default SubServiceProvider;
