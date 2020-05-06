import React, { useState } from 'react';
import { Icon } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';

import './index.less';

const appserviceData = [
  {
    time: 5,
    name: 'Devops Service(devops service)',
    code: 'staging',
    from: 'choerodon持续交付',
  },
  {
    time: 15,
    name: 'Devops Service(devops service)',
    code: 'master',
    from: 'choerodon持续交付',
  },
  {
    time: 25,
    name: 'Devops Service(devops service)',
    code: 'feature-C7NCD-1766',
    from: 'choerodon持续交付',
  },
];


const ServiceList = observer(() => {
  const [expand, changeExpand] = useState(false);

  const renderAppServiceItem = () => (
    appserviceData.map((item, index) => {
      const { time, name, code, from } = item;
      return (
        <div className="c7n-serviceList-content-item">
          <header>
            <Tooltip title={time} placement="top">
              <Icon type="date_range-o" />
            </Tooltip>
            <span className="c7n-serviceList-content-item-date">{time}分钟前 &nbsp;操作</span>
          </header>
          <main>
            <div className="c7n-serviceList-content-item-main">
              <a>{name}</a>
              <span>服务编码：{code}</span>
            </div>
            <Icon type="account_balance" />
          </main>
          <footer>
            <span>{from}</span>
          </footer>
        </div>
      );
    })
  );

  return (
    <div className="c7n-serviceList">
      <div className="c7n-serviceList-title">
        <span>应用服务</span>
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
