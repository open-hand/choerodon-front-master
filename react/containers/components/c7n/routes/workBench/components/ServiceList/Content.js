import React, { useState } from 'react';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import TimePopover from '../time-popover';
import LoadingBar from '../../../../tools/loading-bar';

import './index.less';
import { useRecentAppStore } from './stores';

const ServiceList = observer((props) => {
  const {
    appServiceDs,
    selectedProjectId,
    category,
    history,
    organizationId,
  } = useRecentAppStore();

  const goAppService = (record) => {
    const { projectId, projectName, id } = record.toData() || {};
    const search = `?id=${projectId}&name=${encodeURIComponent(projectName)}&organizationId=${organizationId}&type=project`;
    history.push({
      pathname: '/devops/code-management',
      search,
      state: {
        appServiceId: id,
      },
    });
  };

  const renderAppServiceItem = () => (
    appServiceDs.map((record) => {
      const {
        name, code, projectName, lastUpdateDate, repoUrl,
      } = record.toData() || {};
      return (
        <div className="c7n-serviceList-content-item" key={record.id}>
          <header>
            <Icon type="date_range-o" />
            <span className="c7n-serviceList-content-item-date">
              <TimePopover datetime={lastUpdateDate} />
              &nbsp;操作
            </span>
          </header>
          <main>
            <div className="c7n-serviceList-content-item-main">
              <span
                className="c7n-serviceList-content-item-main-text"
                onClick={() => goAppService(record)}
                role="none"
              >
                {name}
                （
                {code}
                ）
              </span>
            </div>
            <a
              href={repoUrl}
              target="_blank"
              rel="nofollow me noopener noreferrer"
            >
              <Icon type="account_balance" className="c7n-serviceList-content-item-icon" />
            </a>
          </main>
          <footer>
            <span>{projectName}</span>
          </footer>
        </div>
      );
    })
  );

  const getContent = () => ((!appServiceDs || appServiceDs.status === 'loading') ? (
    <LoadingBar display />
  ) : (
    <div className="c7n-serviceList-content">
      {!appServiceDs.length ? (
        <div className="c7n-workbench-empty-span">暂无最近操作的应用服务</div>
      ) : null}
      {renderAppServiceItem()}
    </div>
  ));

  return (
    <div className="c7n-serviceList">
      <div className="c7n-serviceList-title">
        <span>应用服务（最近使用）</span>
      </div>
      {getContent()}
    </div>
  );
});

export default ServiceList;
