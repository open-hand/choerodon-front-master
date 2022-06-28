import React, { useEffect, FunctionComponent } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { message } from 'choerodon-ui';
import { yqcloudApi, siteApi } from '@/apis';

let tryTimes = 0;

const Index = (props: any): any => {
  const {
    AppState: {
      userInfo: {
        id,
      },
    },
  } = props;

  useEffect(() => {
    checkEnabled();
  }, []);

  const checkEnabled = async () => {
    const data = await siteApi.getFeedBack();
    if (data.enable) {
      initSDK();
      initSecret();
    }
  };

  const initSecret = async () => {
    if (id) {
      const secret = await yqcloudApi.getSDKSecret(id);
      if (secret) {
        sessionStorage.setItem('YQ_USER_SECRET', secret);
      }
    } else if (tryTimes <= 3) {
      tryTimes += 1;
      setTimeout(() => {
        initSecret();
      }, 500);
    } else if (tryTimes > 3) {
      message.error('燕千云提单SDK加载失败请重试');
    }
  };

  const initSDK = () => {
    const flag = document.querySelector('.yq-feedback');
    // eslint-disable-next-line
    if (!flag && window._env_.YQ_FEEDBACK_SDK) {
      const script = document.createElement('script');
      // eslint-disable-next-line
      script.src = window._env_.YQ_FEEDBACK_SDK;
      script.async = true;
      document.body.appendChild(script);
    }
  };
};

export default inject('AppState')(observer(Index));
