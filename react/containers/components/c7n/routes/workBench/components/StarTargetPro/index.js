import React from 'react';
import { Button } from 'choerodon-ui/pro';
import emptyImg from '../../../../../../images/owner.png';

import './index.less';

const StarTargetPro = () => (
  <div className="c7n-starTargetPro">
    <p className="c7n-starTargetPro-name">星标项目</p>
    <div className="c7n-starTargetPro-content">
      <img src={emptyImg} alt="empty"/>
      <div className="c7n-starTargetPro-content-emptyText">
        <p className="c7n-starTargetPro-content-emptyText-emptyP">暂无星标</p>
        <p className="c7n-starTargetPro-content-emptyText-emptySuggest">您还没有星标项目，请前往"项目管理"页面进行添加</p>
        <Button funcType="raised" color="primary">转到项目管理</Button>
      </div>
    </div>
  </div>
)

export default StarTargetPro;
