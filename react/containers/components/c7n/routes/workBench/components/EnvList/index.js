import React, { useState } from 'react';

import { Button } from 'choerodon-ui/pro';

import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';

import './index.less';
import StatusDot from '../StatusDot';

const EnvList = observer(() => {
  const [expand, changeExpand] = useState(false);

  return (
    <div className="c7n-envList">
      <div className="c7n-envList-title">
        <span>环境</span>
        <Button
          className="c7n-envList-expand-btn"
          onClick={() => changeExpand(!expand)}
          icon={expand ? 'baseline-arrow_drop_down' : 'baseline-arrow_drop_up'}
          funcType="raised"
          size="small"
        />
      </div>
      <div className="c7n-serviceList-content" style={{ display: !expand ? 'block' : 'none' }}>
        <div className="c7n-envList-content-item">
          <main>
            <div className="c7n-envList-content-item-main">
              <a>
                <StatusDot
                  size="small"
                  connect={false}
                  active
                  failed={false}
                />
                <span style={{ marginLeft: '3px' }}>
                  1212
                </span>
              </a>
              <span>环境编码：1</span>
            </div>
            <span className="c7n-envList-content-item-main-date">2分钟前访问</span>
          </main>
          <footer>
            <span>choerodon持续交付</span>
          </footer>
        </div>
      </div>
    </div>
  );
});

export default EnvList;
