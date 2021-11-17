import React, {
  useMemo, Fragment, ReactElement,
} from 'react';
import groupBy from 'lodash/groupBy';
import initial from 'lodash/initial';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import { Divider } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';
import './index.less';
import classNames from 'classnames';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ButtonProps } from 'choerodon-ui/pro/lib/button/Button';
import Action from '@/components/action';
import { Permission } from '@/components/permission';
import ButtonGroup from '@/components/btn-group';
import { GroupBtnItemProps } from '@/components/btn-group/interface';
import { ToolTipsConfigType } from './interface';

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
  tooltipsConfig?: ToolTipsConfigType,
  element?: React.ReactElement,
  preElement?: React.ReactElement,
  groupBtnItems?: GroupBtnItemProps[],
  // groupBtnConfigs
}

const HeaderButtons = ({ items, children, showClassName = false }: {
  items: Array<itemsProps>,
  children?: ReactElement,
  showClassName?: boolean
}) => {
  const displayBtn = useMemo(() => {
    const filterItems = items.filter(({ display = true }) => display);
    const groupItems = map(filterItems, (value) => {
      const tempGroupItem = value;
      if (!('group' in tempGroupItem)) {
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
    const minGroupKey = Math.min.apply(null, displayBtn.map((value) => value.group));
    const btnGroups = map(groupBy(displayBtn, 'group'), (value, key) => {
      const Split = <Divider key={Math.random()} type="vertical" className="c7ncd-header-split" />;
      const btns = map(value, ({
        name,
        handler,
        iconOnly = false,
        permissions,
        display = true,
        icon,
        disabled,
        color = 'default' as ButtonColor,
        actions,
        tooltipsConfig,
        element,
        preElement,
        groupBtnItems,
        ...props
      }, index:number) => {
        let btn:React.ReactNode;
        const isRefreshIcon = icon === 'refresh' && !name;
        const transColor = index === 0 && Number(key) === minGroupKey && !isRefreshIcon ? 'primary' as ButtonColor : color;
        if (actions) {
          const { data, ...restActionsProps } = actions;
          btn = (
            <Tooltip {...tooltipsConfig}>
              <Action
                {...restActionsProps}
                data={data}
                className="c7ncd-header-action"
                style={{
                  color: '#3f51b5',
                  padding: 0,
                }}
              />
            </Tooltip>
          );
        } else if (groupBtnItems?.length) {
          btn = (
            <ButtonGroup
              btnItems={groupBtnItems}
              tooltipsConfig={tooltipsConfig}
              display={display}
              color={transColor}
              icon={icon}
              name={name}
              disabled={disabled}
            />
          );
        } else if (iconOnly) {
          btn = (
            <>
              <Tooltip {...tooltipsConfig}>
                <Button
                  {...props}
                  disabled={disabled}
                  className="c7ncd-header-btn"
                  onClick={handler}
                  color={transColor}
                  icon={icon}
                />
              </Tooltip>
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
              <Tooltip {...tooltipsConfig}>
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
              </Tooltip>
              {preElement && React.cloneElement(preElement, {})}
            </>
          );
        }

        return (
          <Fragment key={name}>
            {permissions && permissions.length ? (
              <Permission service={permissions}>
                {btn}
              </Permission>
            ) : btn}
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
