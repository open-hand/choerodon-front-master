import React, { cloneElement, Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Dropdown, Icon, Menu } from 'choerodon-ui';
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

  getAllService(data) {
    return data.reduce((list, { service = [] }) => list.concat(service), []);
  }

  renderMenu(data) {
    return (
      <Menu onClick={this.handleClick} style={{ minWidth: 80 }}>
        {data.map((item, i) => this.renderMenuItem(item, i))}
      </Menu>
    );
  }

  renderMenuItem({ service, text, action, icon }, i) {
    const { organizationId, type } = this.props;
    const item = (
      <Item action={action}>
        {icon && <Icon type={icon} />}
        {text}
      </Item>
    );
    return (
      <Permission
        service={service}
        organizationId={organizationId}
        type={type}
        key={i}
        defaultChildren={cloneElement(item, { style: { display: 'none' } })}
        organizationId={organizationId}
        type={type}
      >
        {item}
      </Permission>
    );
  }

  render() {
    const { data, placement, getPopupContainer, disabled, organizationId, type, ...restProps } = this.props;
    return (
      <Permission
        service={this.getAllService(data)}
        organizationId={organizationId}
        type={type}
      >
        <Dropdown overlay={this.renderMenu(data)} trigger={['click']} placement={placement} getPopupContainer={getPopupContainer} disabled={disabled}>
          <Button size="small" shape="circle" style={{ color: '#000' }} icon="more_vert" {...restProps} />
        </Dropdown>
      </Permission>
    );
  }
}
