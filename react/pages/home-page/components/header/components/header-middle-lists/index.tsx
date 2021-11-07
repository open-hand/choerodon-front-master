import React, {
  useEffect, FC, useMemo,
} from 'react';
import { observer } from 'mobx-react-lite';
import { get } from '@choerodon/inject';
import { inject } from 'mobx-react';
import map from 'lodash/map';
import { SERVICE_KNOWLEDGE, SERVICE_MARKET } from '@/constants';
import { defaultLists, KNOWLEDGE_CONFIG, MARKET_CONFIG } from './CONSTANTS';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import ListItem from './components/list-item';

export type HeaderMiddleListsProps = {
  AppState?:any
}

const prefixCls = 'c7ncd-header-middle-lists';
const intlPrefix = 'c7ncd.header.middle.lists';

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
    const tempLists = defaultLists;
    if (serviceCodeLists.includes(SERVICE_KNOWLEDGE)) {
      tempLists.push(KNOWLEDGE_CONFIG);
    }
    if (serviceCodeLists.includes(SERVICE_MARKET) && !isSaas?.[organizationId]) {
      tempLists.push(MARKET_CONFIG);
    }
    return tempLists;
  }, [isSaas, organizationId, serviceCodeLists]);

  const renderLists = () => map(getLists, (config) => <ListItem {...config} />);

  return (
    <div className={prefixCls}>
      {renderLists()}
    </div>
  );
};

export default inject('AppState')(observer(HeaderMiddleLists));
