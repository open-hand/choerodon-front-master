import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import JSONbig from 'json-bigint';
import map from 'lodash/map';
import { Tooltip } from 'choerodon-ui/pro';
import WSHandler from '@/components/ws/WSHandler';

import {} from '@choerodon/components';

import './index.less';
import { useProjectsSelectorStore } from '../../stores';

export type RecentUseProjectsPrps = {
  AppState?:any
}

const RecentUseProjects:FC<RecentUseProjectsPrps> = (props) => {
  const {
    prefixCls,
    handleSelectProjectCallback,
  } = useProjectsSelectorStore();

  const {
    AppState,
  } = props;

  const goto = (item:any) => {
    handleSelectProjectCallback(item);
  };

  const renderLists = () => (AppState.getRecentUse?.length ? (
    <div className={`${prefixCls}-lists-content`}>
      {
        map(AppState.getRecentUse, (item) => (
          <Tooltip title={item.name} placement="rightBottom">
            <div
              onClick={() => goto(item)}
              role="none"
              key={item.tenantId}
              className={`${prefixCls}-lists-content-item`}
            >
              {item.name}
            </div>
          </Tooltip>
        ))
      }
    </div>
  ) : (
    <div className={`${prefixCls}-lists-content-empty`}>
      <span>暂无最近使用项目</span>
    </div>
  ));

  return (
    <WSHandler
      messageKey="latest_visit"
      onMessage={(data: any) => {
        // 这里为什么要遍历一遍，是因为后端的数据结构问题，许多信息都写到了projectDTO属性下面
        AppState.setRecentUse(JSONbig.parse(data).map((i: any) => i.projectDTO));
      }}
    >
      <div className={`${prefixCls}-lists`}>
        <p>最近使用</p>
        {renderLists()}
      </div>
    </WSHandler>
  );
};

export default inject('AppState')(observer(RecentUseProjects));
