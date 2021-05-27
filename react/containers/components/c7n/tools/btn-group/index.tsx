import React, { useCallback, useMemo, useState } from 'react';

import { Menu, Popover, Icon } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { map } from 'lodash';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import classNames from 'classnames';
import Permission from '@/containers/components/c7n/tools/permission';
import { CustomBtnGroupProps, itemsProps } from './interface';

import './index.less';

export {
  itemsProps as GroupBtnItemProps,
  CustomBtnGroupProps,
};

const prefixCls = 'c7ncd-btnGroup';

const BtnGroup = (props:CustomBtnGroupProps) => {
  const {
    color = 'default',
    icon,
    btnItems,
    placement = 'bottomLeft',
    trigger = 'click',
    display = true,
    name,
  } = props;

  const [popverVisible, setVisible] = useState<boolean>(false);

  const renderMenu = useCallback(() => {
    if (!btnItems?.length) {
      return null;
    }
    return map(btnItems, (itemProps:itemsProps, index:number) => {
      const {
        name: itemName,
        handler,
        permissions,
        disabled,
        group,
        tooltipsConfig,
      } = itemProps;
      const Item = (
        <Menu.Item
          disabled={disabled}
          key={`${name}-${index}-${group}`}
          onClick={handler}
        >
          <Tooltip {...tooltipsConfig}>
            {itemName}
          </Tooltip>
        </Menu.Item>
      );
      if (permissions?.length) {
        return (
          <Permission service={permissions}>
            {Item}
          </Permission>
        );
      }
      return Item;
    });
  }, [btnItems]);

  const menu = useMemo(() => (
    <Menu onClick={() => setVisible(false)}>
      {renderMenu()}
    </Menu>
  ), [renderMenu]);

  const dropdownBtnCls = classNames(prefixCls);

  const dropDownIconCls = classNames(`${prefixCls}-dropdownIcon`, `${prefixCls}-dropdownIcon-${color}`);

  if (!display) {
    return null;
  }

  return (
    <Popover
      visible={popverVisible}
      content={menu}
      trigger={trigger}
      placement={placement}
      overlayClassName={`${prefixCls}-popver`}
      onVisibleChange={(visible:boolean) => setVisible(visible)}
    >
      <Button
        className={dropdownBtnCls}
        color={color as ButtonColor}
        icon={icon}
      >
        <span>{name}</span>
        <Icon className={dropDownIconCls} type="expand_more" />
      </Button>
    </Popover>
  );
};

export default BtnGroup;
