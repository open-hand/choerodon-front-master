import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import StatusDot from '../StatusDot';
import TimePopover from '../time-popover';
import { useWorkBenchStore } from '../../stores';

import './index.less';

const EnvList = observer(() => {
  const {
    history,
    AppState: { currentMenuType: { organizationId } },
    workBenchUseStore,
  } = useWorkBenchStore();
  const [expand, changeExpand] = useState(false);
  const [envList, setEnvList] = useState([]);
  const { id: projectId, category } = workBenchUseStore.getActiveStarProject || {};

  useEffect(() => {
    const env = localStorage.envRecentItem ? JSON.parse(localStorage.envRecentItem) : [];
    let realEnv;
    if (projectId) {
      realEnv = env.filter((item) => item.projectId === projectId && item.organizationId === organizationId);
    } else {
      realEnv = env.filter((item) => item.organizationId === organizationId);
    }
    setEnvList(realEnv);
  }, [workBenchUseStore.getActiveStarProject]);

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

  if (projectId && (category === 'AGILE' || category === 'PROGRAM')) {
    return null;
  }

  return (
    <div className="c7n-envList">
      <div className="c7n-envList-title">
        <span>环境（最近使用）</span>
        <Button
          className="c7n-envList-expand-btn"
          onClick={() => changeExpand(!expand)}
          icon={expand ? 'baseline-arrow_drop_down' : 'baseline-arrow_drop_up'}
          funcType="raised"
          size="small"
        />
      </div>
      <div className="c7n-serviceList-content" style={{ display: !expand ? 'block' : 'none' }}>
        {!envList.length ? (
          <div className="c7n-workbench-empty-span">暂无最近操作的环境</div>
        ) : null}
        {envList.map(({ name, code, projectName, clickTime, active, connect, id, projectId: realProjectId }) => (
          <div className="c7n-envList-content-item">
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
                <span className="c7n-envList-content-item-main-code">环境编码：{code}</span>
              </div>
              <span className="c7n-envList-content-item-main-date">
                <TimePopover datetime={clickTime} />
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
