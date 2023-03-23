import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import uniqWith from 'lodash/uniqWith';
import { TimePopover } from '@zknow/components';
import StatusDot from '../StatusDot';
import { useWorkBenchStore } from '../../stores';

import './index.less';

const EnvList = observer(() => {
  const {
    history,
    AppState: { currentMenuType: { organizationId } },
    selectedProjectId,
    formatWorkbench,
  } = useWorkBenchStore();
  const [envList, setEnvList] = useState([]);
  useEffect(() => {
    const env = localStorage.envRecentItem ? JSON.parse(localStorage.envRecentItem) : [];
    const realEnv = uniqWith(env, (arrVal, othVal) => ((arrVal.id === othVal.id || arrVal.code === othVal.code)
      && String(arrVal.organizationId) === String(othVal.organizationId)
      && String(arrVal.projectId) === String(othVal.projectId)
    ));
    localStorage.envRecentItem = JSON.stringify(realEnv);
  }, []);

  useEffect(() => {
    const env = localStorage.envRecentItem ? JSON.parse(localStorage.envRecentItem) : [];
    let realEnv;
    if (selectedProjectId) {
      realEnv = env.filter((item) => String(item.projectId) === String(selectedProjectId) && String(item.organizationId) === String(organizationId));
    } else {
      realEnv = env.filter((item) => String(item.organizationId) === String(organizationId));
    }
    setEnvList(realEnv);
  }, [selectedProjectId, organizationId]);

  function linkToEnv({ envId, projectName, realProjectId }) {
    history.push({
      pathname: '/devops/resource',
      search: `?id=${realProjectId}&name=${encodeURIComponent(projectName)}&organizationId=${organizationId}&type=project`,
      state: {
        envId,
        viewType: 'instance',
      },
    });
  }

  return (
    <div className="c7n-envList">
      <div className="c7n-envList-title">
        <span>{formatWorkbench({ id: 'environment' })}</span>
      </div>
      <div className="c7n-serviceList-content">
        {!envList.length ? (
          <div className="c7n-workbench-empty-span">
            {
              formatWorkbench({ id: 'noEnvironmentsTodo' })
            }
          </div>
        ) : null}
        {envList.map(({
          name, code, projectName, clickTime, active, connect, id, projectId: realProjectId,
        }) => (
          <div className="c7n-envList-content-item" id={`${realProjectId}-${id}`}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
            <main onClick={() => linkToEnv({ envId: id, projectName, realProjectId })}>
              <div className="c7n-envList-content-item-main">
                <span className="c7n-envList-content-item-main-title">
                  <StatusDot
                    size="small"
                    synchronize
                    active={active}
                    connect={connect}
                    failed={false}
                  />
                  <span style={{ marginLeft: '3px' }}>
                    {name}
                  </span>
                </span>
                <span className="c7n-envList-content-item-main-code">
                  环境编码：
                  {code}
                </span>
              </div>
              <span className="c7n-envList-content-item-main-date">
                <TimePopover content={clickTime} />
              </span>
            </main>
            <footer>
              <span>{projectName}</span>
            </footer>
          </div>
        ))}
      </div>
    </div>
  );
});

export default EnvList;
