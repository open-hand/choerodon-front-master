import NoMatch from '@/components/c7n-error-pages/404';

export { default as C7NIcon } from '@/components/c7n-icon';

export { default as axios } from '@/components/axios';

export { default as store } from './containers/components/c7n/tools/store';

export { default as stores } from './containers/stores';
export { NoMatch };
/**
 *  路由不匹配时 404页面
 * @deprecated 后续使用 NoMatch
 */
export const nomatch = NoMatch;
export { default as NoAccess } from '@/components/c7n-error-pages/403';

export { default as WSHandler } from '@/components/ws/WSHandler';
export { default as WSProvider } from '@/components/ws/WSProvider';

export { default as StatusTag } from '@/components/statusTag/StatusTag';

export { default as ThemeWrap } from '@/components/themeWrap';

export { default as SagaDetails } from '@/components/saga-details';

export { default as Choerodon } from './utils/choerodon';

export { default as PermissionRoute } from './components/permission-route';

export { default as useTheme } from './hooks/useTheme';

export { default as ButtonGroup } from './components/btn-group';

export { default as OverviewWrap } from './containers/components/c7n/routes/projectOverview/components/OverviewWrap';
export { default as SprintEmptyPage } from './containers/components/c7n/routes/projectOverview/components/EmptyPage';
export { useProjectOverviewStore } from './containers/components/c7n/routes/projectOverview/stores';

export { default as Charts } from './containers/components/c7n/routes/charts';

export { default as TabCode } from './utils/tabCode';

export { default as transformResponseTreeData } from './utils/transformResponseTreeData';

export { default as checkPermission } from './utils/checkPermission';

export { default as BrowserAdapter } from './components/browser-adapter';

export { logout } from './utils/authorize';

export * as CONSTANTS from './constants';

// 导出Page, Content, Header结构组件
export * from '@/components/c7n-page';

// 导出PageTabsWrapper，TabPage，PageTab 结构组件
export * from '@/components/c7n-tab-page';

// 导出Permission组件以及PermissionProvider
export * from '@/components/permission';

// Action
export { default as Action } from '@/components/action';

export { default as UserLabels } from '@/components/userLabels';

// 头部按钮组件
export { default as HeaderButtons } from '@/components/header-btns';

// 高阶组件导出
export * from '@/hoc';

// locale
export { default as C7NFormat } from '@/components/c7n-formatMessage';
export { default as C7NFormatCommon } from '@/components/c7n-formatCommon';
export { default as C7NLocaleProvider } from '@/components/c7n-locale-provider';

// 面包屑组件
export { default as Breadcrumb } from '@/components/c7n-breadCrumb';

// apis
export * from '@/apis';

export * from '@/functions';

// hooks
export * from '@/hooks';

export type { UserInfoProps, useFormatMessageRetrunTypes, LanguageTypes } from './typings';
export { default as getNearlyDays } from './utils/getNearlyDays';

export { default as openCreateNotification } from '@/components/notification';

export { default as ExternalComponent } from '@/components/external-component';
export { default as getExternalFunc } from '@/utils/getExternalFunc';
export * from '@/utils/to';
export * from '@/utils/log';
export * from '@/components/provider';
export * from '@/utils/LocalPageCacheStore';
// 导出模态框
export { Modal } from '@/components/modal';
export { Route, Switch, withRouter } from 'react-router-dom';
export { default as getEnv } from '@/utils/getEnv';
export { default as addAction } from '@/utils/addAction';

export * from '@/utils/downloadFileRedirect';

export { default } from './app';
