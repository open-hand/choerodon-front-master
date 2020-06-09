import React, { Fragment } from 'react';
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

  function getDate() {
    const date = new Date();
    const [a, month, day] = date.toDateString().split(' ');
    return (
      <span className="c7n-selfInfo-date">
        <span className="c7n-selfInfo-date-day">{day}</span>
        <span className="c7n-selfInfo-date-month">{month}</span>
      </span>
    );
  }
  
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
        {getDate()}
      </div>
      <div className="c7n-selfInfo-email">
        <Icon type="email-o" className="c7n-selfInfo-email-icon" />
        <span className="c7n-selfInfo-email-text">{email}</span>
      </div>
    </div>
  );
};

export default SelfIntro;
