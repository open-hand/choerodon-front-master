import React, {
  FC,
  useCallback, useMemo, useState,
} from 'react';

import { Menu, Popover, Icon } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';
import _, { flatten, map } from 'lodash';

import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import classNames from 'classnames';
import { Permission } from '@/components/permission';
import { CustomBtnGroupProps, GroupBtnItemProps } from './interface';

import './index.less';

const prefixCls = 'c7ncd-btnGroup';

/**
 * 按钮分组组件 + 鉴权 + tooltips
 * @param {CustomBtnGroupProps} props
 * @return {*}
 */
const BtnGroup:FC<any> = (props) => {
  const {
    color = 'default',
    icon,
    btnItems,
    placement = 'bottomLeft',
    trigger = 'click',
    display = true,
    name,
    disabled: triggerBtnDisabled = false,
    renderCustomDropDownPanel,
    tooltipsConfig,
    popoverVisibleChange,
    noHiddenChange,
  } = props;

  const {
    hidden: tooltipHidden,
    onHiddenBeforeChange,
    ...tooltipsConfigRestProps
  } = tooltipsConfig || {};

  const [popverVisible, setVisible] = useState<boolean>(false);
  const [mainTooltipHidden, setMainTooltipHidden] = useState<boolean>(false);

  const renderMenu = useCallback(() => {
    if (!btnItems?.length) {
      return null;
    }
    return map(btnItems.filter((i: any) => i?.display || _.isNull(i?.display) || _.isUndefined(i?.display)), (itemProps:any, index:number) => {
      const {
        name: itemName,
        handler,
        permissions,
        disabled,
        group,
        tooltipsConfig: itemToolTipsConfig,
        icon: itemIcon,
        img,
      } = itemProps;
      const Item = (
        <Menu.Item
          disabled={disabled}
          key={`${name}-${itemName}-${index}-${group}`}
        >
          <Tooltip {...itemToolTipsConfig}>
            <span role="none" onClick={disabled ? () => {} : handler}>
              {
                itemIcon ? (
                  <Icon type={itemIcon} />
                ) : ''
              }
              {
                img ? (
                  <img
                    style={{
                      width: '18px',
                      marginRight: 6,
                      position: 'relative',
                      bottom: 1,
                    }}
                    src={img}
                    alt=""
                  />
                ) : ''
              }
              {itemName}
            </span>
          </Tooltip>
        </Menu.Item>
      );
      if (permissions?.length) {
        return (
          <Permission
            defaultChildren={React.cloneElement(Item, { style: { display: 'none' } })}
            service={permissions}
          >
            {Item}
          </Permission>
        );
      }
      return Item;
    });
  }, [btnItems, name]);

  const renderContent = useCallback(() => {
    if (typeof renderCustomDropDownPanel === 'function') {
      return popverVisible && (
        <div className={`${prefixCls}-customPanel`}>
          {renderCustomDropDownPanel((isVisible = false, e:Event) => {
            e && e.stopPropagation();
            setVisible(isVisible);
          })}
        </div>
      );
    }
    return renderMenu();
  }, [popverVisible, renderCustomDropDownPanel, renderMenu]);

  const menu = useMemo(() => (
    <Menu onClick={() => setVisible(false)}>
      {renderContent()}
    </Menu>
  ), [renderContent]);

  const dropdownBtnCls = classNames(prefixCls);

  const dropDownIconCls = classNames(
    `${prefixCls}-dropdownIcon`,
    `${prefixCls}-dropdownIcon-${color}`,
  );

  if (!display) {
    return null;
  }

  const onVisibleChange = (visible:boolean) => {
    popoverVisibleChange?.(visible);
    setVisible(visible);
  };

  const getHidden = () => popverVisible || tooltipHidden || mainTooltipHidden;

  const handleOnHiddenChange = (hidden:boolean) => {
    if (typeof onHiddenBeforeChange === 'function') {
      onHiddenBeforeChange(hidden);
    } else {
      setMainTooltipHidden(hidden);
    }
  };

  return (
    <Permission service={btnItems?.every((item) => item?.permissions?.length) ? flatten(btnItems?.map((item) => item?.permissions || [])) : []}>
      <Tooltip
        {...tooltipsConfigRestProps}
        {
          ...noHiddenChange ? {} : {
            hidden: getHidden(),
          }
        }
        onHiddenChange={handleOnHiddenChange}
      >
        <Popover
          visible={popverVisible}
          content={menu}
          trigger={trigger}
          placement={placement}
          overlayClassName={`${prefixCls}-popver`}
          onVisibleChange={onVisibleChange}
        >
          <Button
            className={dropdownBtnCls}
            color={color as ButtonColor}
            icon={icon}
            disabled={triggerBtnDisabled}
          >
            <span>{name}</span>
            <Icon className={dropDownIconCls} type="expand_more" />
          </Button>
        </Popover>
      </Tooltip>
    </Permission>
  );
};

export default BtnGroup;
