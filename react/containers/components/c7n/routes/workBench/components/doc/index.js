import React from 'react';
import map from 'lodash/map';
import { Tooltip } from 'choerodon-ui/pro';
import TimePopover from '../time-popover';

import './index.less';

const data = [
  {
    projectName: 'Choerodon持续交付',
    title: 'C7N服务融合为hzero服务步骤',
    updateTime: '2020-04-30 15:52:57',
    users: [
      {
        userName: 'aaa',
        userUrl: '',
      },
      {
        userName: 'bbb',
        userUrl: '',
      },
      {
        userName: 'ccc',
        userUrl: '',
      },
      {
        userName: 'ddd',
        userUrl: '',
      },
    ],
    type: 'create',
  },
  {
    orgName: '基础架构管理-区块链中台',
    title: '功能平台化整体逻辑',
    updateTime: '2020-04-10 15:52:57',
    users: [
      {
        userName: 'aaa',
        userUrl: '',
      },
    ],
    type: 'create',
  },
  {
    projectName: 'Choerodon持续交付',
    title: 'C7N服务融合为hzero服务步骤',
    updateTime: '2020-05-01 15:52:57',
    users: [
      {
        userName: 'aaa',
        userUrl: '',
      },
      {
        userName: 'bbb',
        userUrl: '',
      },
      {
        userName: 'ccc',
        userUrl: '',
      },
      {
        userName: 'ddd',
        userUrl: '',
      },
      {
        userName: 'eee',
        userUrl: '',
      },
    ],
    type: 'update',
  },
];

const StarTargetPro = () => (
  <div className="c7n-workbench-doc-content">
    {map(data, ({ projectName, title, users, updateTime, type, orgName }) => (
      <div className="c7n-workbench-doc-item">
        <div className="c7n-workbench-doc-item-info">
          <span className={`c7n-workbench-doc-item-logo c7n-workbench-doc-item-logo-${type}`}>
            {title.toUpperCase().substring(0, 1)}
          </span>
          <div className="c7n-workbench-doc-item-userlist">
            {map(users.slice(0, 3), ({ userName, userUrl }) => (
              <Tooltip
                placement="top"
                title={userName}
              >
                {userUrl ? (
                  <img
                    className="c7n-workbench-doc-item-userlist-item"
                    src={userUrl}
                    alt=""
                  />
                ) : (
                  <span className="c7n-workbench-doc-item-userlist-item">
                    {(userName || '').substring(0, 1).toUpperCase()}
                  </span>
                )}
              </Tooltip>
            ))}
            {users.length > 3 && (
              <Tooltip
                placement="top"
                title="aaa"
              >
                <span className="c7n-workbench-doc-item-userlist-item">
                  +{users.length - 3}
                </span>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="c7n-workbench-doc-item-project">
          <span>{orgName || projectName }</span>
          {orgName && <span className="c7n-workbench-doc-item-org">组织</span>}
        </div>
        <div className="c7n-workbench-doc-item-title">
          <Tooltip title={title}>
            <span className="c7n-workbench-doc-item-title-text">{title}</span>
          </Tooltip>
          <span className="c7n-workbench-doc-item-time">
            <TimePopover datetime={updateTime} />
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default StarTargetPro;
