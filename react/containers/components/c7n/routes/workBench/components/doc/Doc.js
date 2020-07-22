import React, { useEffect } from 'react';
import map from 'lodash/map';
import { Tooltip } from 'choerodon-ui/pro';
import TimePopover from '../time-popover';
import EmptyPage from '../empty-page';

import './index.less';
import { useDoc } from './stores';

const Doc = () => {
  const { docStore } = useDoc();
  useEffect(() => {
    // docStore.axiosGetDoc();
  }, []);
  return (
    <div className="c7n-workbench-doc-content">
      <EmptyPage
        title="暂无文档信息"
        describe="暂无文档相关的记录，请直接前往知识库中查看"
      />
      {map([], ({ projectName, title, users, updateTime, type, orgName }) => (
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
            <span>{orgName || projectName}</span>
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
};

export default Doc;
