import React, { useEffect } from 'react';
import { Button, Icon } from 'choerodon-ui';
import './index.less';
import axios from '@/components/axios';

const prefixCls = 'c7ncd-saasUser-announcement';

function getSaaSUserAvilableDays(orgId:string) {
  if (orgId) {
    return axios.get(`/iam/choerodon/v1/organizations/trial_due?organization_id=${orgId}`);
  }
  return new Promise((resolve) => {
    resolve(undefined);
  });
}

export {
  getSaaSUserAvilableDays,
};

const SaaSUserAnnouncement = (props:{
  data:{
    restDays:string
    link:string
  },
  onCloseCallback: CallableFunction
}) => {
  const {
    data: {
      link,
      restDays,
    },
    onCloseCallback,
  } = props;

  useEffect(() => {

  }, []);

  const handleInfo = () => {
    link && window.open(link);
  };

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-info`}>
        <Icon type="error_outline" style={{ fontSize: 20, color: '#FA541CFF' }} />
        <span>
          免费试用还剩
          <span style={{
            color: '#FA541CFF',
          }}
          >
            {restDays || 0}
          </span>
          天
        </span>
      </div>
      {/* <Button
        type="primary"
        funcType="raised"
        disabled={!link}
        onClick={handleInfo}
        style={{ height: 26, fontSize: 13 }}
      >
        升级到付费版
      </Button> */}
    </div>
  );
};

export default SaaSUserAnnouncement;
