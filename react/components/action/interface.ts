import { TooltipPlacement } from 'choerodon-ui/lib/tooltip';
import { Placements } from 'choerodon-ui/pro/lib/dropdown/enum';
import { CSSProperties } from 'react';
import { PermissionService, PermissionType } from '../permission/interface';

type ActionProps = {
  data?: ActionItemProps[]
  placement?: Placements
  getPopupContainer?: ((triggerNode: Element) => HTMLElement)
  disabled?:boolean
  style?:CSSProperties
  organizationId?:string | number
  type?:PermissionType
  className?:string
}

type ActionItemProps = {
  service?:PermissionService
  text:string
  action?: (e:Event) => any
  icon?:string
  disabled?:boolean
  tooltipsConfig?:ToolTipsConfigType
}

export interface ToolTipsConfigType {
  title?: string,
  placement?: TooltipPlacement,
  style?: React.CSSProperties,
  overlayStyle?: React.CSSProperties,
  defaultVisible?: boolean,
  visible?: boolean,
  arrowPointAtCenter?: boolean;
  overlayClassName?:string
}

export {
  ActionItemProps,
  ActionProps,
};
