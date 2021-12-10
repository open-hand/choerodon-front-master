import React, {
  useEffect, FC,
} from 'react';
import { Button } from 'choerodon-ui/pro';
import ErrorImg from '@/assets/images/popoverHead.png';
import Logo from '@/assets/images/favicon.svg';

import './index.less';
import { DEFAUTL_SYSTEM_NAME } from '@/constants';
import { useFormatCommon, useFormatMessage } from '@/hooks';

export type ErrorPageProps = {
  error?:any
  errorMsg?: any
}

const prefixCls = 'c7ncd-error-page';
const intlPrefix = 'c7ncd.error.page';

const ErrorPage:FC<ErrorPageProps> = (props) => {
  const {
    error,
    errorMsg,
  } = props;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-container`}>
        <div className={`${prefixCls}-left`}>
          <div className={`${prefixCls}-header`}>
            <img alt="logo" src={Logo} />
            <span>
              {DEFAUTL_SYSTEM_NAME}
            </span>
          </div>
          <p>发生未知异常，请联系开发人员...</p>
          <main>
            <span>{String(error)}</span>
            <pre>{errorMsg?.componentStack}</pre>
          </main>
        </div>
        <div className={`${prefixCls}-right`}>
          <img alt="errorImg" src={ErrorImg} />
          <div className={`${prefixCls}-btngroups`}>
            <Button
              color={'primary'as any}
              onClick={handleReload}
              icon="refresh"
            >
              刷新页面
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
