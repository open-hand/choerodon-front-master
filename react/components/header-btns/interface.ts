import { TooltipPlacement } from 'choerodon-ui/lib/tooltip';

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
