import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

const PREFIX_CLS = 'c7n';
const prefixCls = `${PREFIX_CLS}-boot-header-logo`;

@withRouter
@inject('AppState', 'MenuStore')
@observer
export default class Logo extends Component {
  render() {
    const { AppState } = this.props;
    const { systemLogo, systemName } = AppState.getSiteInfo;
    
    return (
      <div className={`${prefixCls}-wrap`}>
        <div className={classnames(`${prefixCls}-icon`, systemLogo ? null : `${prefixCls}-default-icon`)} style={{ backgroundImage: systemLogo ? `url(${systemLogo})` : null }} />
        <div className={classnames(`${prefixCls}`, systemName ? null : `${prefixCls}-default-logo`)}>{systemName}</div>
      </div>
    );
  }
}
