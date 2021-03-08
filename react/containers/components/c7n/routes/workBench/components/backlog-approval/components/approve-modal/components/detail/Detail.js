import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './Detail.less';
import Part from './Part';

const prefix = 'c7n-backlogApprove-backlogDetail';

const Detail = () => {
  useEffect(() => {

  });
  return (
    <div className={prefix}>
      <div className={`${prefix}-left`}>
        <Part
          title="详情"
          style={{
            height: '100%',
          }}
        >
          我是详情part
        </Part>
      </div>
      <div className={`${prefix}-right`}>
        <Part
          title="描述"
          style={{
            height: '50%',
          }}
        >
          我是描述part
        </Part>
        <Part
          title="附件"
          style={{
            height: '50%',
          }}
        >
          我是附件part
        </Part>
      </div>
    </div>
  );
};

export default observer(Detail);
