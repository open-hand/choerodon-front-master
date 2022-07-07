import React, { useEffect, FunctionComponent } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { message } from 'choerodon-ui';
import { yqcloudApi, siteApi } from '@/apis';

let tryTimes = 0;
let maxOrgNameTimes = 0;

const Index = (props: any): any => {
  const {
    AppState: {
      menuType: {
        name,
      },
      userInfo: {
        id,
      },
    },
    AppState,
  } = props;

  useEffect(() => {
    setFieldsSession();
  }, [AppState?.currentOrginazationOrProjectId]);

  useEffect(() => {
    checkEnabled();
  }, []);

  const checkEnabled = async () => {
    const data = await siteApi.getFeedBack();
    if (data.enable) {
      // initSDK();
      initSecret(data?.token);
    }
  };

  const setFieldsSession = () => {
    if (AppState?.currentProject?.organizationName) {
      const fields = {
        input_mxnzeblk: AppState?.currentProject?.organizationName,
      };
      sessionStorage.setItem('YQ_FIELD_DATA', JSON.stringify(fields));
    } else if (maxOrgNameTimes < 3) {
      setTimeout(() => {
        maxOrgNameTimes += 1;
        setFieldsSession();
      }, 1000);
    } else if (maxOrgNameTimes >= 3) {
      const fields = {
        input_mxnzeblk: name,
      };
      sessionStorage.setItem('YQ_FIELD_DATA', JSON.stringify(fields));
    }
  };

  const initSecret = async (token: string) => {
    if (id) {
      const secret = await yqcloudApi.getSDKSecret(id);
      if (secret) {
        setFieldsSession();
        sessionStorage.setItem('YQ_USER_SECRET', secret);
        initSDK(token);
      }
    } else if (tryTimes <= 3) {
      tryTimes += 1;
      setTimeout(() => {
        initSecret(token);
      }, 500);
    } else if (tryTimes > 3) {
      message.error('燕千云提单SDK加载失败请重试');
    }
  };

  const initSDK = (token: any) => {
    const flag = document.querySelector('.yq-feedback');
    // eslint-disable-next-line
    if (!flag && window._env_.YQ_FEEDBACK_SDK) {
      const script = document.createElement('script');
      // eslint-disable-next-line
      script.src = `${window._env_.YQ_FEEDBACK_SDK}/${token}/feedback.js`;
      script.async = true;
      document.body.appendChild(script);
    }
  };
};

export default inject('AppState')(observer(Index));
