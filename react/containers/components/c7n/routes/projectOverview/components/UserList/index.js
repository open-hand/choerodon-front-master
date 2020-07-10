import React, { useState, memo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Tooltip, Select } from 'choerodon-ui/pro';
import { useProjectOverviewStore } from '../../stores';
import OverviewWrap from '../OverviewWrap';

import './index.less';

const UserList = () => {
  const {
    userListDs,
  } = useProjectOverviewStore();
  const clsPrefix = 'c7n-project-overview-user-list';

  return (
    <OverviewWrap height={459}>
      <OverviewWrap.Header title={`活跃成员(${0})`} />
      {userListDs.map((record) => {
        const { imageUrl, loginName, realName, roles } = record.toData();
        return (
          <div className={`${clsPrefix}-item`} key={record.id}>
            <Tooltip title={`${realName} (${loginName})`} placement="top">
              <span
                className={`${clsPrefix}-item-avatar`}
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : '',
                }}
              >
                {!imageUrl && realName && realName.slice(0, 1)}
              </span>
            </Tooltip>
            <span className={`${clsPrefix}-item-name`}>{realName}</span>
            <span className={`${clsPrefix}-item-status`}>活跃</span>
            <div className={`${clsPrefix}-item-roles`}>
              {roles.map(({ name: roleName }) => (
                <span className={`${clsPrefix}-item-roles-item`}>{roleName}</span>
              ))}
            </div>
          </div>
        );
      })}
    </OverviewWrap>
  );
};

export default observer(UserList);
