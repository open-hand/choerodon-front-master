import React, { Fragment, memo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Pagination, Tooltip, Select } from 'choerodon-ui/pro';
import { useProjectOverviewStore } from '../../stores';
import OverviewWrap from '../OverviewWrap';
import EmptyPage from '../EmptyPage';

import './index.less';

const UserList = () => {
  const {
    userListDs,
    projectOverviewStore,
  } = useProjectOverviewStore();
  const clsPrefix = 'c7n-project-overview-user-list';

  return (
    <OverviewWrap>
      <OverviewWrap.Header title={`在线成员(${projectOverviewStore.getTotalOnlineUser})`} />
      {projectOverviewStore.getTotalOnlineUser ? (
        <Fragment>
          <div className={`${clsPrefix}-content`}>
            {userListDs.map((record) => {
              const { imageUrl, loginName, realName, roleNames } = record.toData();
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
                    {(roleNames.split(',') || []).map((item) => (
                      <span className={`${clsPrefix}-item-roles-item`}>{item}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {projectOverviewStore.getTotalOnlineUser > 8 ? <Pagination dataSet={userListDs} className={`${clsPrefix}-pagination`} /> : null}
        </Fragment>
      ) : <EmptyPage content="当前暂无数据" />}
    </OverviewWrap>
  );
};

export default observer(UserList);
