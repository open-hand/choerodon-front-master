import React, { useCallback, useMemo, useState } from 'react';

import { Menu, Popover, Icon } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { flatten, map } from 'lodash';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import classNames from 'classnames';
import Permission from '@/containers/components/c7n/tools/permission';
import { CustomBtnGroupProps, GroupBtnItemProps } from '@/containers/components/c7n/tools/btn-group/interface';

import './index.less';

// export {
//   itemsProps as GroupBtnItemProps,
//   CustomBtnGroupProps,
// };

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
    disabled: triggerBtnDisabled = false,
  } = props;

  const [popverVisible, setVisible] = useState<boolean>(false);

  const renderMenu = useCallback(() => {
    if (!btnItems?.length) {
      return null;
    }
    return map(btnItems, (itemProps:GroupBtnItemProps, index:number) => {
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
          key={`${name}-${itemName}-${index}-${group}`}
        >
          <Tooltip {...tooltipsConfig}>
            <span role="none" onClick={disabled ? () => {} : handler}>
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
    <Permission service={flatten(btnItems?.map((item) => item?.permissions || []))}>
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
          disabled={triggerBtnDisabled}
        >
          <span>{name}</span>
          <Icon className={dropDownIconCls} type="expand_more" />
        </Button>
      </Popover>
    </Permission>
  );
};

export default BtnGroup;
