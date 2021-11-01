import { ButtonProps } from 'choerodon-ui/lib/button';
import { TooltipPlacement } from 'choerodon-ui/lib/tooltip';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ReactNode } from 'react';
import { ToolTipsConfigType } from '../header-btns/interface';

export interface CustomBtnGroupProps {
  color?: ButtonColor
  name: string,
  display?:boolean,
  icon?: string,
  btnItems?: GroupBtnItemProps[],
  placement?: TooltipPlacement,
  trigger?: 'click' | 'hover' | 'focus' | 'contextMenu'
  disabled?: boolean
  renderCustomDropDownPanel?: (visbileSet?:CallableFunction)=> ReactNode,
}

export interface GroupBtnItemProps extends ButtonProps {
  name: string,
  handler?(): void,
  permissions?: Array<string>,
  disabled?: boolean,
  group?: number,
  tooltipsConfig?: ToolTipsConfigType,
}
