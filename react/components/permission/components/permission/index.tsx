/* eslint-disable react/no-deprecated */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import React, {
  Children, cloneElement, Component, isValidElement,
} from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Omit from 'lodash/omit';
import { FAILURE, PENDING, SUCCESS } from '../../stores/CONSTANTS';
import { PermissionProps, PermissionStatusProps } from '../../interface';

/**
 *  权限校验组件，is still rebuilding
 * @class Permission
 * @extends {Component<PermissionProps>}
 */
@inject('AppState')
@observer
class Permission extends Component<PermissionProps> {
  static contextTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    permission: PropTypes.any,
  };

  state = {
    status: PENDING,
  };

  componentWillMount() {
    this.check(this.props, this.context);
  }

  componentWillReceiveProps(nextProps:PermissionProps, nextContext:any) {
    this.check(nextProps, nextContext);
  }

  componentDidMount() {
    this.triggerAccess();
  }

  componentDidUpdate(preProps:PermissionProps, preState:{status: PermissionStatusProps}) {
    this.triggerAccess(preState);
  }

  triggerAccess(preState = {} as {status: PermissionStatusProps}) {
    const { status } = this.state;
    const { onAccess } = this.props;
    if (status === SUCCESS && preState.status !== SUCCESS && typeof onAccess === 'function') {
      onAccess();
    }
  }

  check(props:PermissionProps, context:{permission:any}) {
    if (context.permission) {
      context.permission.check(this.getPermissionProps(props), this.handlePermission);
    }
  }

  handlePermission = (status:PermissionStatusProps) => {
    this.setState({
      status,
    });
  };

  getPermissionProps(props:PermissionProps) {
    const {
      type: typeState = 'site', id = 0, projectId: projectIdState, organizationId: organizationIdState,
    } = props.AppState.currentMenuType || {};
    const {
      service,
      type = typeState,
      organizationId = organizationIdState || id,
      projectId = projectIdState || id,
    } = props;
    return {
      service,
      type,
      organizationId,
      projectId,
    };
  }

  extendProps(children:any, props:PermissionProps) {
    if (isValidElement(children)) {
      return Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, props);
        }
        return child;
      });
    }
    return children;
  }

  render() {
    const { defaultChildren, children, noAccessChildren } = this.props;
    const otherProps = Omit(this.props, [
      'service', 'type', 'organizationId', 'projectId', 'defaultChildren',
      'noAccessChildren', 'children', 'onAccess', 'AppState',
    ]);
    const { status } = this.state;
    if (typeof children === 'function') {
      return children(status === SUCCESS, status === PENDING);
    }
    if (status === SUCCESS) {
      return this.extendProps(children, otherProps);
    } if (status === FAILURE && (noAccessChildren || defaultChildren)) {
      return this.extendProps(noAccessChildren || defaultChildren, otherProps);
    } if (status === PENDING && defaultChildren) {
      return this.extendProps(defaultChildren, otherProps);
    }
    return null;
  }
}

export default Permission;
