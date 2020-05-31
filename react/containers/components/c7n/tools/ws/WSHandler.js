/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getCookie } from '@/utils';
import AppState from '../../../../stores/c7n/AppState';

export default class WSHandler extends Component {
  static defaultProps = {
    path: () => `websocket?group=choerodon:msg:site-msg:${AppState.userInfo.id}&processor=choerodon_msg&access_token=${getCookie('access_token')}`,
    dataKey: 'message',
    typeKey: 'key',
  };

  static propTypes = {
    messageKey: PropTypes.string.isRequired,
    type: PropTypes.string,
    path: PropTypes.string, // 能从Provider获得指定path的连接
    autoReconnect: PropTypes.bool, // 在WebSocket连接断开后要能自动重连
    onMessage: PropTypes.func,
    onCreate: PropTypes.func,
    onClose: PropTypes.func,
    onError: PropTypes.func,
    onRetry: PropTypes.func,
    dataKey: PropTypes.string,
    typeKey: PropTypes.string,
  };

  static contextTypes = {
    ws: PropTypes.object,
  };

  state = {
    data: null,
  };

  componentWillMount() {
    this.register(this.props, this.context);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.messageKey !== this.props.messageKey
      || this.getPath(nextProps.path) !== this.getPath(this.props.path)) {
      this.unregister(this.props, this.context);
      this.register(nextProps, nextContext);
    }
  }

  componentWillUnmount() {
    this.unregister(this.props, this.context);
  }

  getPath(path) {
    if (typeof path === 'string') {
      return path;
    } else if (typeof path === 'function') {
      return path();
    } else {
      return undefined;
    }
  }

  handleMessage = (data) => {
    const { onMessage, type, dataKey, typeKey } = this.props;
    if (typeof onMessage === 'function') {
      onMessage(JSON.parse(data)[dataKey]);
    }
    if (type) {
      const jsonData = JSON.parse(data);
      if (jsonData[typeKey] === type) {
        this.setState({
          data: jsonData[dataKey],
        });
      }
    } else {
      this.setState({
        data: JSON.parse(data)[dataKey],
      });
    }
  };

  register(props, context) {
    const { messageKey, path } = props;
    const { ws } = context;
    if (ws) {
      ws.register(messageKey, { type: 'notify', key: messageKey }, this.handleMessage, this.getPath(path));
    }
  }

  unregister(props, context) {
    const { messageKey, path } = props;
    const { ws } = context;
    if (ws) {
      ws.unregister(messageKey, this.handleMessage, this.getPath(path));
    }
  }

  render() {
    const { data } = this.state;
    const { children } = this.props;
    if (typeof children === 'function') {
      return children(data);
    } else {
      return children;
    }
  }
}
