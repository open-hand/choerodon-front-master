import React, { useEffect } from 'react';
import { Icon } from 'choerodon-ui/pro';
import { useWorkBenchStore } from '../../stores';

import './index.less';

const SelfIntro = () => {
  const {
    AppState: { getUserInfo },
  } = useWorkBenchStore();

  const {
    imageUrl,
    realName,
    loginName,
    email,
  } = getUserInfo || {};

  useEffect(() => {

  }, []);
  
  return (
    <div className="c7n-selfInfo">
      <div className="c7n-selfInfo-title">
        {imageUrl ? (
          <img
            src={imageUrl}
            className="c7n-selfInfo-head"
            alt=""
          />
        ) : (
          <span className="c7n-selfInfo-head">
            {(realName || '').substring(0, 1).toUpperCase()}
          </span>
        )}
        <span className="c7n-selfInfo-name">Hi，{realName}</span>
      </div>
      <div className="c7n-selfInfo-email">
        <Icon type="email-o" />
        <span>{email}</span>
      </div>
    </div>
  );
};

export default SelfIntro;
