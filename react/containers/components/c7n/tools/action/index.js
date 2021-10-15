/*
 * @Author: isaac
 * @LastEditors: isaac
 * @Description:
 * i made my own lucky
 */
import React, { cloneElement, Component } from 'react';
import { observer } from 'mobx-react';
import {
  Button, Dropdown, Icon, Menu,
} from 'choerodon-ui';
import Permission from '../permission';

const { Item } = Menu;

@observer
export default class Action extends Component {
  static defaultProps = {
    data: [],
  };

  state = {};

  handleClick = (arg) => {
    arg.domEvent.stopPropagation();
    const { action } = arg.item.props;
    if (typeof action === 'function') {
      action();
    }
  };

  getAllService (data) {
    return data.reduce((list, { service = [] }) => list.concat(service), []);
  }

  renderMenu (data) {
    return (
      <Menu onClick={this.handleClick} style={{ minWidth: 80 }}>
        {data.map((item, i) => this.renderMenuItem(item, i))}
      </Menu>
    );
  }

  renderMenuItem ({
    service, text, action, icon, disabled,
  }, i) {
    const { organizationId, type } = this.props;
    const item = (
      <Item
        action={disabled ? () => { } : action}
        style={disabled ? {
          color: 'rgba(15, 19, 88, 0.25)',
          cursor: 'not-allowed',
          backgroundColor: 'rgb(246, 246, 249)',
        } : {}}
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
  }

  render () {
    const {
      data, placement, getPopupContainer, disabled, organizationId, type, style, ...restProps
    } = this.props;
    return (
      <Permission
        service={this.getAllService(data)}
        organizationId={organizationId}
        type={type}
      >
        <Dropdown overlay={this.renderMenu(data)} trigger={['click']} placement={placement} getPopupContainer={getPopupContainer} disabled={disabled}>
          <Button
            size="small"
            shape="circle"
            style={{ color: '#5365EA', ...style }}
            icon="more_vert"
            {...restProps}
            onClick={(e) => e && e.stopPropagation()}
          />
        </Dropdown>
      </Permission>
    );
  }
}
