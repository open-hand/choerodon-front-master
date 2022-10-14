/* eslint-disable react/no-unused-prop-types */
import React, { createElement } from 'react';
import { COMPONENT_DEFAULT_PROPS } from '@/constants';

export const Context = React.createContext({});
export interface PageTabProps {
    alwaysShow?: boolean
    title?: React.ReactNode
    tabKey: string
    component: string | React.FunctionComponent<any> | React.ComponentClass<any, any>
    route?: string
}
const PageTab: React.FC<PageTabProps> = ({ children }) => <>{children}</>;
PageTab.defaultProps = COMPONENT_DEFAULT_PROPS;
export default PageTab;
