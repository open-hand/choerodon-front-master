import { TooltipProps } from 'choerodon-ui/pro/lib/tooltip/interface';

type PickTooltipProps =
'title'|
'placement'|
'style'|
'arrowPointAtCenter' |
'onHiddenBeforeChange'|
'defaultHidden';
export interface ToolTipsConfigType extends Pick<TooltipProps, PickTooltipProps> {
  overlayStyle?: React.CSSProperties,
  overlayClassName?:string
  hidden?:boolean
}
