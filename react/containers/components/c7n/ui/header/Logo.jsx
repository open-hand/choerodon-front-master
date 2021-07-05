import React, { Component, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import useTheme from '@/hooks/useTheme';
import favicon from '../../../../images/favicon.svg';

const PREFIX_CLS = 'c7n';
const prefixCls = `${PREFIX_CLS}-boot-header-logo`;

export default withRouter(inject('AppState', 'MenuStore')(observer((props) => {
  const [schema] = useTheme();
  const { AppState } = props;
  const { systemLogo, systemName } = AppState.getSiteInfo;
  return (
    <div
      className={classnames({
        [`${prefixCls}-wrap`]: true,
        [`${prefixCls}-wrap-theme4`]: schema === 'theme4',
      })}
    >
      <div className={classnames(`${prefixCls}-icon`, systemLogo ? null : `${prefixCls}-default-icon`)} style={{ backgroundImage: systemLogo ? `url(${systemLogo})` : `url(${favicon})` }} />
      <div className={classnames(schema === 'theme4' ? `${prefixCls}-theme4` : null, `${prefixCls}`, systemName ? null : `${prefixCls}-default-logo`)}>{systemName || 'Choerodon'}</div>
    </div>
  );
})));
