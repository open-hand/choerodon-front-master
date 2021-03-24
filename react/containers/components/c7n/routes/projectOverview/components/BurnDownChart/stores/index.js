import React, {
  createContext, useContext, useCallback, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro/lib';
import useStore from './useStore';

import ChartDatesDataSet from './ChartDatesDataSet';
import ChartDataSet from './ChartDataSet';

import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function useBurnDownChartStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId } },
  } = props;

  const { startedRecord } = useProjectOverviewStore();

  // 缺陷累积趋势ds
  const charDatesDs = useMemo(() => new DataSet(ChartDatesDataSet({ organizationId, projectId, startedRecord })), [organizationId, projectId, startedRecord]);
  const chartDs = useMemo(() => new DataSet(ChartDataSet({ projectId, startedRecord, charDatesDs })), [charDatesDs, projectId, startedRecord]);

  const loadBurnDownData = useCallback(async () => {
    try {
      const res = await charDatesDs.query();
      if (res && res.failed) {
        return;
      }
      chartDs.setQueryParameter('datesData', res);
      await chartDs.query();
    } catch (error) {
      throw new Error(error);
    }
  }, [charDatesDs, chartDs]);

  const burnDownChartStore = useStore(organizationId, projectId);

  const value = {
    ...props,
    burnDownChartStore,
    chartDs,
    loadBurnDownData,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
