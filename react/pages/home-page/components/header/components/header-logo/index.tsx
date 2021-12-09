import React, {
  FC, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import C7NImg from '@/assets/images/favicon.svg';
import { DEFAUTL_SYSTEM_NAME } from '@/constants';

import './index.less';

export type HeaderLogoProps = {
  AppState?:any
}

const prefixCls = 'c7ncd-header-logo';

const HeaderLogo:FC<HeaderLogoProps> = (props) => {
  const {
    AppState,
  } = props;

  // to do remove AppState
  const { systemLogo, systemName } = AppState.getSiteInfo;

  const getSystemName = useMemo(() => systemName || DEFAUTL_SYSTEM_NAME, [systemName]);

  const getSystemImg = useMemo(() => systemLogo || C7NImg, [systemLogo]);

  const goHome = () => {
    // history.push(HOMEPAGE_PATH);
  };

  return (
    <div className={prefixCls} role="none" onClick={goHome}>
      <img src={getSystemImg} alt="logo" className={`${prefixCls}-img`} />
      <div className={`${prefixCls}-text`}>
        {getSystemName}
      </div>
    </div>
  );
};

export default inject('AppState')(observer(HeaderLogo));
