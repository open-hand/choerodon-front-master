import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import JSONbig from 'json-bigint';
import map from 'lodash/map';
import { Tooltip } from 'choerodon-ui/pro';
import { useHistory } from 'react-router';
import WSHandler from '@/components/ws/WSHandler';

import {} from '@choerodon/components';

import './index.less';
import { useProjectsSelectorStore } from '../../stores';
import handleClickProject from '@/utils/gotoProject';

export type StarProjectsListsProps = {
  AppState?:any
}

const StarProjectsLists:FC<StarProjectsListsProps> = (props) => {
  const {
    prefixCls,
    mainStore,
    handleSelectProjectCallback,
  } = useProjectsSelectorStore();

  const history = useHistory();

  const {
    AppState,
  } = props;

  const goto = (item:any) => {
    handleSelectProjectCallback(item);
  };

  const renderLists = () => (AppState.getStarProject?.length ? (
    <div className={`${prefixCls}-lists-content`}>
      {
        map(AppState.getStarProject, (item) => (
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
      <span>暂无星标项目</span>
    </div>
  ));

  return (
    <WSHandler
      messageKey="star-projects"
      onMessage={(data: any) => {
        AppState.setStarProject(JSONbig.parse(data));
      }}
    >
      <div className={`${prefixCls}-lists`}>
        <p>星标项目</p>
        {renderLists()}
      </div>
    </WSHandler>
  );
};

export default inject('AppState')(observer(StarProjectsLists));
