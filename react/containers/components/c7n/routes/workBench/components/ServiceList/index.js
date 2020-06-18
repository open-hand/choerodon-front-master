import React, { useState } from 'react';
import { Icon } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { useWorkBenchStore } from '../../stores';
import TimePopover from '../time-popover';

import './index.less';

const ServiceList = observer((props) => {
  const {
    history,
    appServiceDs,
    AppState: { currentMenuType: { organizationId } },
  } = useWorkBenchStore();

  const [expand, changeExpand] = useState(false);

  function goAppService(record) {
    const { projectId, projectName, id } = record.toData() || {};
    const search = `?id=${projectId}&name=${projectName}&organizationId=${organizationId}&type=project`;
    history.push({
      pathname: '/devops/code-management',
      search,
      state: {
        appServiceId: id,
      },
    });
  }

  const renderAppServiceItem = () => (
    appServiceDs.map((record) => {
      const { name, code, projectName, lastUpdateDate, id } = record.toData() || {};
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
              >
                {name}（{code}）
              </span>
            </div>
            <a href="#" target="blank">
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

  return (
    <div className="c7n-serviceList">
      <div className="c7n-serviceList-title">
        <span>应用服务（最近使用）</span>
        <Button
          className="c7n-serviceList-expand-btn"
          onClick={() => changeExpand(!expand)}
          icon={expand ? 'baseline-arrow_drop_down' : 'baseline-arrow_drop_up'}
          funcType="raised"
          size="small"
        />
      </div>
      <div className="c7n-serviceList-content" style={{ display: !expand ? 'block' : 'none' }}>
        {renderAppServiceItem()}
      </div>
    </div>
  );
});

export default ServiceList;
