import React, { cloneElement, Component } from 'react';
import { observer } from 'mobx-react';
import {
  Button, Dropdown, Icon, Menu,
} from 'choerodon-ui';
import { Size } from 'choerodon-ui/lib/_util/enum';
import { get } from 'lodash';
import classNames from 'classnames';
import { Permission } from '@/components/permission';
import { ActionItemProps, ActionProps } from './interface';
import './index.less';

const { Item } = Menu;

const prefixCls = 'c7ncd-action';

const menuItemDisabeldStyle = {
  color: 'rgba(15, 19, 88, 0.25)',
  cursor: 'not-allowed',
  backgroundColor: 'rgb(246, 246, 249)',
};

/**
 * 三点图标组件，权限校验 + 下拉
 * @param {*} props
 * @return {*}
 */
const Action:React.FC<ActionProps> = (props) => {
  const {
    data,
    placement,
    getPopupContainer,
    disabled: dropDownDisabled,
    organizationId,
    type,
    style,
    className,
    ...restProps
  } = props;

  const cls = classNames(prefixCls, className);

  const handleClick = (arg:any) => {
    arg.domEvent?.stopPropagation();
    const { action } = arg.item.props;
    if (typeof action === 'function') {
      action();
    }
  };

  const getAllService = () => {
    if (!data) return [];
    return data.reduce((list, { service = [] }) => list.concat(service), [] as string[]);
  };

  const renderMenu = () => (
    data ? (
      <Menu onClick={handleClick} style={{ minWidth: 80 }}>
        {data.map((item, i) => renderMenuItem(item, i))}
      </Menu>
    ) : ''
  );

  const renderMenuItem = ({
    service, text, action, icon, disabled,
  }:ActionItemProps, i:number) => {
    const item = (
      <Item
        action={disabled ? () => { } : action}
        style={disabled ? menuItemDisabeldStyle : {}}
      >
        {icon && <Icon type={icon} />}
        {text}
      </Item>
    );
    return (
      <Permission
        service={service}
        organizationId={organizationId}
        key={i}
        defaultChildren={cloneElement(item, { style: { display: 'none' } })}
        type={type}
      >
        {item}
      </Permission>
    );
  };

  if (!data || !get(data, 'length')) {
    return null;
  }

  return (
    <Permission
      service={getAllService()}
      organizationId={organizationId}
      type={type}
    >
      <Dropdown
        overlay={renderMenu()}
        className={cls}
        trigger={['click']}
        placement={placement}
        getPopupContainer={getPopupContainer}
        disabled={dropDownDisabled}
      >
        <Button
          size={'small' as Size}
          shape="circle"
          style={{ color: '#5365EA', ...style }}
          icon="more_vert"
          onClick={(e) => e && e.stopPropagation()}
          className={cls}
          {...restProps}
        />
      </Dropdown>
    </Permission>
  );
};

export default observer(Action);
