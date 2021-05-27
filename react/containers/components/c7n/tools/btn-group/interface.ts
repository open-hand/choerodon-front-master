import { ButtonProps } from 'choerodon-ui/lib/button';
import { TooltipPlacement } from 'choerodon-ui/lib/tooltip';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ToolTipsConfigType } from '../header-btns/interface';

export interface CustomBtnGroupProps {
  color?: ButtonColor
  name: string,
  display?:boolean,
  icon?: string,
  btnItems?: itemsProps[],
  placement?: TooltipPlacement,
  trigger?: 'click' | 'hover' | 'focus' | 'contextMenu'
}

export interface itemsProps extends ButtonProps {
  name: string,
  handler?(): void,
  permissions?: Array<string>,
  disabled?: boolean,
  group?: number,
  tooltipsConfig?: ToolTipsConfigType,
}
