import React, {
  useCallback, useMemo, useState,
} from 'react';

import { Menu, Popover, Icon } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { flatten, map } from 'lodash';
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
    renderCustomDropDownPanel,
    button,
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

  const renderContent = useCallback(() => {
    if (renderCustomDropDownPanel && typeof renderCustomDropDownPanel === 'function') {
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
        {
          button
        || (
        <Button
          className={dropdownBtnCls}
          color={color as ButtonColor}
          icon={icon}
          disabled={triggerBtnDisabled}
        >
          <span>{name}</span>
          <Icon className={dropDownIconCls} type="expand_more" />
        </Button>
        )
}
      </Popover>
    </Permission>
  );
};

export default BtnGroup;
