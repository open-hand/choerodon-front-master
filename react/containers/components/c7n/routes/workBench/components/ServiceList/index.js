import React, { useState } from 'react';
import { Icon } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';

import './index.less';
import {useWorkBenchStore} from "../../stores";
import TimePopover from "../time-popover";

const appserviceData = [
  {
    time: 5,
    name: 'Devops Service',
    code: 'staging',
    from: 'choerodon持续交付',
  },
  {
    time: 15,
    name: 'Devops Service',
    code: 'master',
    from: 'choerodon持续交付',
  },
  {
    time: 25,
    name: 'Devops Service',
    code: 'feature-C7NCD-1766',
    from: 'choerodon持续交付',
  },
];


const ServiceList = observer((props) => {
  const {
    history,
    appServiceDs,
  } = useWorkBenchStore();

  const [expand, changeExpand] = useState(false);

  function goAppService(appServiceId) {
    history.push({
      pathname: '/devops/code-management',
      state: {
        appServiceId,
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
                onClick={() => goAppService(id)}
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
