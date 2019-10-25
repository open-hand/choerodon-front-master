import React, { useContext, useEffect } from 'react';
import { Button } from 'choerodon-ui/pro';
import { authorizeC7n as authorize } from '../../../../common';
import './index.less';


function ListView() {
  return (
    <div className="c7n-master-unauthorized">
      <div className="c7n-master-unauthorized-content">
        <div className="c7n-master-unauthorized-picture" />
        <div className="c7n-master-unauthorized-text">抱歉，您未登录或身份认证已失效，请点击下方按钮重新登录！</div>
        <Button onClick={authorize} className="relogin" funcType="raised" color="blue">
          重新登录
        </Button>
      </div>
    </div>
    
  );
}

export default ListView;
