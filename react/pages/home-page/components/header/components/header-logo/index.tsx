import React, {
  FC, useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import C7NImg from '@/assets/images/favicon.svg';

import './index.less';
import { HOMEPAGE_PATH } from '@/constants';

export type HeaderLogoProps = {
  AppState?:any
}

const prefixCls = 'c7ncd-header-logo';
const intlPrefix = 'c7ncd.header.logo';
const DEFAULT_SYSTEM_NAME = 'Choerodon';

const HeaderLogo:FC<HeaderLogoProps> = (props) => {
  const {
    AppState,
  } = props;

  const history = useHistory();

  // to do remove AppState
  const { systemLogo, systemName } = AppState.getSiteInfo;

  const getSystemName = useMemo(() => systemName || DEFAULT_SYSTEM_NAME, [systemName]);

  const getSystemImg = useMemo(() => systemLogo || C7NImg, [systemLogo]);

  const goHome = () => {
    history.push(HOMEPAGE_PATH);
  };

  return (
    <div className={prefixCls} onClick={goHome} role="none">
      <img src={getSystemImg} alt="logo" className={`${prefixCls}-img`} />
      <div className={`${prefixCls}-text`}>
        {getSystemName}
      </div>
    </div>
  );
};

export default inject('AppState')(observer(HeaderLogo));
