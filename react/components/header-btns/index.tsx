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
import { ActionProps } from '../action/interface';
import { PermissionService } from '../permission/interface';

export interface IHeaderButtonItemRefresh extends IHeaderButtonItemProps {
  icon: 'refresh',
}
export type IHeaderButtonItem = IHeaderButtonItemProps & ButtonProps & {
  icon?: string,
}
export interface IHeaderButtonItemActions {
  /**
   * 三个点的按钮组
   */
  actions?: ActionProps,
}
export interface IHeaderButtonItemProps {
  /** 唯一key  */
  key?: React.Key
  /**
   * 按钮名称
   * 当为 string时会构成 唯一`key`
   * @description `key` 属性优先级最大
   */
  name?: React.ReactNode

  /**
   * 点击事件
   */
  handler?(): void,
  /**
   * 按钮颜色
   */
  color?: ButtonColor,
  /**
   * 是否仅显示 Icon
   * @deprecated 废弃属性， 当不传`name`时会不显示
   */
  iconOnly?: boolean;

}
interface IHeaderElementItemProps {
  /**
   * 自定义显示内容
   */
  element: React.ReactElement,
}

interface IHeaderGroupButtonItemProps {
  /**
   * 按钮组
   */
  groupBtnItems: GroupBtnItemProps[],
  name: string
}
export type itemsProps = {
  /**
   * 是否展示
   * @default true
   */
  display?: boolean;
  /**
   * 按钮 / Actions / 按钮组
   * tooltip配置
   */
  tooltipsConfig?: ToolTipsConfigType,
  /**
   * 权限codes
   */
  permissions?: PermissionService,
  /**
   * 是否禁止
   * */
  disabled?: boolean,
  /**
   * 元素组别
   */
  group?: number,
  /**
   * 前置自定义内容
   */
  preElement?: React.ReactElement,
} & (IHeaderButtonItem | IHeaderButtonItemRefresh | IHeaderButtonItemActions | IHeaderGroupButtonItemProps | IHeaderElementItemProps)

type ItemInnerProps = itemsProps & IHeaderButtonItem & IHeaderButtonItemRefresh & IHeaderButtonItemActions &
  IHeaderGroupButtonItemProps & IHeaderElementItemProps
// TODO: 需要优化
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
      const btns = map(value as any[], ({
        name,
        handler,
        iconOnly: propsIconOnly = false,
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
        noHiddenChange,
        key: propsKey,
        ...props
      }, index: number) => {
        let iconOnly = propsIconOnly;
        let btn: React.ReactNode;
        const itemName = name as string;
        const isRefreshIcon = icon === 'refresh' && !name;
        if (isRefreshIcon) {
          iconOnly = true;
        }
        const componentKey = propsKey ?? typeof itemName === 'string' ? undefined : itemName;
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
              key={componentKey}
              btnItems={groupBtnItems}
              tooltipsConfig={tooltipsConfig}
              display={display}
              color={transColor}
              icon={icon}
              name={name}
              disabled={disabled}
              noHiddenChange={noHiddenChange}
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
                  {itemName}
                </Button>
              </Tooltip>
              {preElement && React.cloneElement(preElement, {})}
            </>
          );
        }

        return (
          <Fragment key={itemName}>
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
