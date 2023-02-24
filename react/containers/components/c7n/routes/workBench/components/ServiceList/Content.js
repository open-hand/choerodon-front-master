import React from 'react';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { get } from '@choerodon/inject';

import { Loading, TimePopover } from '@zknow/components';

import './index.less';
import { useRecentAppStore } from './stores';
import { useWorkBenchStore } from '../../stores';

const ServiceList = observer((props) => {
  const {
    formatWorkbench,
  } = useWorkBenchStore();
  const {
    appServiceDs,
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
              <TimePopover style={{ display: 'inline-block' }} content={lastUpdateDate} />
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
    <Loading display type={get('configuration.master-global:loadingType') || 'c7n'} />
  ) : (
    <div className="c7n-serviceList-content">
      {!appServiceDs.length ? (
        <div className="c7n-workbench-empty-span">
          {
            formatWorkbench({ id: 'noServiceTodeal' })
          }
        </div>
      ) : null}
      {renderAppServiceItem()}
    </div>
  ));

  return (
    <div className="c7n-serviceList">
      <div className="c7n-serviceList-title">
        <span>{formatWorkbench({ id: 'appService' })}</span>
      </div>
      {getContent()}
    </div>
  );
});

export default ServiceList;
