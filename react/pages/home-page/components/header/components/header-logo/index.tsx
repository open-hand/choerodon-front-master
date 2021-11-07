import React, {
  FC, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import C7NImg from '@/assets/images/favicon.svg';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';

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

  const { systemLogo, systemName } = AppState.getSiteInfo;

  const getSystemName = useMemo(() => systemName || DEFAULT_SYSTEM_NAME, [systemName]);

  const getSystemImg = useMemo(() => systemLogo || C7NImg, [systemLogo]);

  return (
    <div className={prefixCls}>
      <img src={getSystemImg} alt="logo" className={`${prefixCls}-img`} />
      <div className={`${prefixCls}-text`}>
        {getSystemName}
      </div>
    </div>
  );
};

export default inject('AppState')(observer(HeaderLogo));
