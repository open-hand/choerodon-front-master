import React, {
  createContext, useContext, useCallback, useMemo, useEffect, useState,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro/lib';

import { get, mount } from '@choerodon/inject';
import { toJS } from 'mobx';
import JSONbig from 'json-bigint';
import axios from '@/containers/components/c7n/tools/axios';
import { isEmpty } from 'lodash';
import useStore from './useStore';
import { useProjectOverviewStore } from '../../../stores';
import getOptions from './utils';

const JSONbigString = JSONbig({ storeAsString: true });

const Store = createContext();
// 需提供一个能返回echarts图表配置数据的方法
const loadOptionDataMaps = {
  agile: get('agile:AgileCustomChartLoadData'),
};
export function useCustomChartStore() {
  return useContext(Store);
}
// const useCustomReportData=C7N
export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children, customChartConfig, customChartConfig: { customData },
    AppState: { currentMenuType: { organizationId, projectId } },
  } = props;

  const { startedRecord, customChartAvailableList } = useProjectOverviewStore();
  const [optionConfig, setOptionConfig] = useState({});

  // TODO:后续需要假如其他服务，请使用使用customChartAvailableList 进行判断是否有服务 保证进来使用的hook是存在的
  // const { loading, optionConfig } = get('agile:AgileCustomChartUseChartHook')(customChartConfig);
  useEffect(() => {
    async function loadOptionData() {
      const config = {

        chartType: customData.chartType,
        statisticsType: customData.statisticsType,
        analysisField: customData.analysisField,
        comparedField: customData.comparedField,
        analysisFieldPredefined: !['pro', 'org'].includes(String(customData.analysisField).split('_')[0]), //
        comparedFieldPredefined: !['pro', 'org'].includes(String(customData.comparedField).split('_')[0]),
        searchVO: isEmpty(customData.searchJson) ? undefined : JSONbigString.parse(customData.searchJson),
      };
      const res = await axios(`/agile/v1/projects/${projectId}/reports/custom_chart`, {
        data: config, method: 'post', params: { organizationId }, enabledCancelCache: false,
      });
      const data = (res.dimensionList || []).map((item) => ({ ...item, pointList: item.pointList.map((point) => ({ ...point, value: parseFloat(point.value.toString()) })) }));
      const newOptions = isEmpty(data) ? undefined : getOptions(customData.chartType, customData.statisticsType, data, 12);
      setOptionConfig(newOptions);
    }
    loadOptionData(toJS(customChartConfig));
  }, [customChartConfig, customData.analysisField, customData.chartType, customData.comparedField, customData.searchJson, customData.statisticsType, organizationId, projectId]);

  const value = {
    ...props,
    customData,
    optionConfig,
    loading: typeof (optionConfig) === 'object' && !Object.keys(optionConfig).length,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
