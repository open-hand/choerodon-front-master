import React, {
  createContext, useContext, useEffect, useState, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import { toJS } from 'mobx';
import { isEmpty, noop, uniqueId } from 'lodash';
import { useProjectOverviewStore } from '../../../stores';
import useExternalFunc from '@/hooks/useExternalFunc';

const Store = createContext();

export function useCustomChartStore() {
  return useContext(Store);
}
// const useCustomReportData=C7N
export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children, customChartConfig, customChartConfig: { customData },
    AppState: { currentMenuType: { organizationId, projectId } },
  } = props;
  const { customChartAvailableList } = useProjectOverviewStore();
  const [optionConfig, setOptionConfig] = useState({});
  const [searchVO, setSearchVO] = useState();
  const [searchId, setSearchId] = useState();
  const [initData, setInitData] = useState();

  const { func: loadAgileCustomChart } = useExternalFunc('agile', 'agile:AgileCustomChartLoadData');

  // 需提供一个能返回echarts图表配置数据的方法
  const loadOptionDataMaps = useMemo(() => ({
    agile: loadAgileCustomChart?.default || noop,
  }), [loadAgileCustomChart]);

  // TODO:后续需要假如其他服务，请使用使用customChartAvailableList 进行判断是否有服务
  useEffect(() => {
    async function loadOptionData() {
      const config = toJS(customChartConfig);
      const newOptions = await loadOptionDataMaps.agile({ ...config, customData: { ...config.customData, extendSearchVO: searchVO } });
      setOptionConfig(isEmpty(newOptions) ? undefined : newOptions);
      setInitData((oldValue) => {
        if (oldValue) {
          return oldValue;
        }
        return newOptions || 'empty';
      });
      setSearchId(uniqueId('overview-search'));
    }
    loadOptionData();
  }, [customChartConfig, searchVO, loadOptionDataMaps]);

  const value = {
    ...props,
    customData,
    optionConfig,
    isHasData: initData !== 'empty',
    searchId,
    searchProps: { searchVO, setSearchVO },
    loading: typeof (optionConfig) === 'object' && !Object.keys(optionConfig).length,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
