import React, {
  useMemo, Fragment, ReactElement,
} from 'react';
import groupBy from 'lodash/groupBy';
import initial from 'lodash/initial';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import Permission from '@/containers/components/c7n/tools/permission';
import Action from '@/containers/components/c7n/tools/action';
import { Divider } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';
import './index.less';
import classNames from 'classnames';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { TooltipProps } from 'choerodon-ui/lib/tooltip';
import { ButtonProps } from 'choerodon-ui/pro/lib/button/Button';
import { toolTipsConfigType } from './interface';

export interface itemsProps extends ButtonProps {
  display: boolean,
  name: string,
  handler?(): void,
  permissions?: Array<string>,
  disabled?: boolean,
  icon?: string,
  group?: number,
  color?: ButtonColor,
  iconOnly?: boolean;
  actions?: any,
  tooltipsConfig?: Pick<TooltipProps, toolTipsConfigType>
  element?: React.ReactElement,
  preElement?: React.ReactElement,
}

const HeaderButtons = ({ items, children, showClassName = false }: {
  items: Array<itemsProps>,
  children?: ReactElement,
  showClassName?: boolean
}) => {
  const displayBtn = useMemo(() => {
    const filterItems = items.filter(({ display }) => display);
    const groupItems = map(filterItems, (value) => {
      const tempGroupItem = value;
      if (!tempGroupItem?.group) {
        tempGroupItem.group = 0;
      } else if (typeof tempGroupItem?.group !== 'string') {
        tempGroupItem.group = Number(tempGroupItem.group);
      }
      return tempGroupItem;
    });
    return groupItems;
  }, [items]);

  const cls = classNames('c7ncd-header-btn-flex', {
    'c7ncd-header-btns': showClassName,
  });

  const btnNodes = useMemo(() => {
    const btnGroups = map(groupBy(displayBtn, 'group'), (value, key) => {
      const Split = <Divider key={Math.random()} type="vertical" className="c7ncd-header-split" />;
      const btns = map(value, ({
        name,
        handler,
        iconOnly = false,
        permissions,
        display,
        icon,
        disabled,
        color = 'default' as ButtonColor,
        actions,
        tooltipsConfig,
        element,
        preElement,
        ...props
      }, index:number) => {
        let btn:React.ReactNode;
        const transColor = index === 0 && Number(key) === 0 ? 'primary' as ButtonColor : color;
        if (actions) {
          const { data, ...restActionsProps } = actions;
          btn = (
            <Action
              {...restActionsProps}
              data={data}
              className="c7ncd-header-action"
              style={{
                color: '#3f51b5',
                padding: 0,
              }}
            />
          );
        } else if (iconOnly) {
          btn = (
            <>
              <Button
                {...props}
                disabled={disabled}
                className="c7ncd-header-btn"
                onClick={handler}
                icon={icon}
              />
              {preElement && React.cloneElement(preElement, {})}
            </>

          );
        } else if (element) {
          btn = (
            <>
              {React.cloneElement(element, {
                disabled,
                className: 'c7ncd-header-btn',
                onClick: handler,
                color: transColor,
                icon,
              })}
              {preElement && React.cloneElement(preElement, {})}
            </>
          );
        } else {
          btn = (
            <>
              <Button
                {...props}
                disabled={disabled}
                className="c7ncd-header-btn"
                onClick={handler}
                color={transColor}
                icon={icon}
              >
                {name}
              </Button>
              {preElement && React.cloneElement(preElement, {})}
            </>
          );
        }

        const toolBtn = (
          <Tooltip {...tooltipsConfig}>{btn}</Tooltip>
        );

        return (
          <Fragment key={name}>
            {permissions && permissions.length ? (
              <Permission service={permissions}>
                {toolBtn}
              </Permission>
            ) : toolBtn}
          </Fragment>
        );
      });

      return [...btns, Split];
    });

    return initial(flatten(btnGroups));
  }, [displayBtn]);

  return displayBtn.length ? (
    <div
      className={cls}
    >
      {btnNodes}
      {children}
    </div>
  ) : null;
};

HeaderButtons.defaultProps = {
  children: undefined,
  showClassName: false,
};

export default HeaderButtons;
