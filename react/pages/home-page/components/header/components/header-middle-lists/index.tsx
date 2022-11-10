import React, {
  useEffect, FC, useMemo,
} from 'react';
import { observer } from 'mobx-react-lite';
import { get } from '@choerodon/inject';
import { inject } from 'mobx-react';
import map from 'lodash/map';
import { SERVICE_KNOWLEDGE, SERVICE_MARKET } from '@/constants';
import {
  KNOWLEDGE_CONFIG, MARKET_CONFIG, WORKBENCH_CONFIG, WORKCALENDAR_CONFIG,
} from './CONSTANTS';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import ListItem from './components/list-item';

export type HeaderMiddleListsProps = {
  AppState?:any
}

interface ItemProps {
  title: string,
  path: string,
  style?: React.CSSProperties,
  permissions?: string[],
}

const prefixCls = 'c7ncd-header-middle-lists';
const intlPrefix = 'c7ncd.header.middle.lists';
const HAS_AGILE_PRO = C7NHasModule('@choerodon/agile-pro');

const HeaderMiddleLists:FC<HeaderMiddleListsProps> = (props) => {
  const {
    AppState,
  } = props;

  const {
    getIsSaasList: isSaas,
    currentMenuType: {
      organizationId,
    },
    currentServices,
  } = AppState;

  // 获取后端服务codelists
  const serviceCodeLists = map(currentServices, 'serviceCode');

  // todo....这里可以拆出去
  // 组织改变 重新查询getIsSaas
  useEffect(() => {
    if (isSaas && !Object.keys(isSaas).includes(organizationId)) {
      get('base-saas:getIsSaas') && get('base-saas:getIsSaas')(AppState, isSaas);
    }
  }, [organizationId]);

  // todo....
  useEffect(() => {
    get('base-saas:getIsSaas') && get('base-saas:getIsSaas')(AppState, isSaas);
  }, []);

  const getLists = useMemo(() => {
    const tempLists: ItemProps[] = [
      WORKBENCH_CONFIG,
    ];
    if (HAS_AGILE_PRO) {
      tempLists.push(WORKCALENDAR_CONFIG);
    }
    // 知识库按钮
    if (serviceCodeLists.includes(SERVICE_KNOWLEDGE)) {
      tempLists.push(KNOWLEDGE_CONFIG);
    }
    // 新功能去掉
    // if (serviceCodeLists.includes(SERVICE_MARKET) && !isSaas?.[organizationId]) {
    //   tempLists.push(MARKET_CONFIG);
    // }
    return map(tempLists, (config) => <ListItem {...config} />);
  }, [isSaas, organizationId, serviceCodeLists]);

  return (
    <div className={prefixCls}>
      {getLists}
    </div>
  );
};

export default inject('AppState')(observer(HeaderMiddleLists));
