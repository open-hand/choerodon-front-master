import React, { useEffect, FunctionComponent, useMemo } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { message } from 'choerodon-ui';
import { yqcloudApi, siteApi } from '@/apis';

let tryTimes = 0;
let maxOrgNameTimes = 0;

const Index = (props: any): any => {
  const {
    AppState: {
      menuType: {
        organizationId,
        name,
      },
      userInfo: {
        id,
      },
    },
    AppState,
    HeaderStore: {
      getOrgData,
    },
  } = props;

  const currentOrgData = useMemo(() => (getOrgData ? toJS(getOrgData) : []), [getOrgData]);

  const currentSelectedOrg = useMemo(() => currentOrgData.find((v: { id: any; }) => String(v.id) === String(organizationId || id)), [currentOrgData, id, organizationId]);

  const {
    tenantName,
  } = currentSelectedOrg || {};

  useEffect(() => {
    setFieldsSession();
  }, [tenantName]);

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
    if (tenantName) {
      const fields = {
        input_mxnzeblk: tenantName,
      };
      sessionStorage.setItem('YQ_FIELD_DATA', JSON.stringify(fields));
    } else if (maxOrgNameTimes < 3) {
      setTimeout(() => {
        maxOrgNameTimes += 1;
        setFieldsSession();
      }, 1000);
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

export default inject('AppState', 'HeaderStore')(observer(Index));
