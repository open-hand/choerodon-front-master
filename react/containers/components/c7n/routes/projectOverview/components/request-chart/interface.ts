import { IntlFormatters } from 'react-intl';
import { StoreProps } from './stores/useStore';

export type RequestChartIndexProps = {
};

export type RequestChartStoreContext = {
  prefixCls: 'c7ncd-request-chart'
  intlPrefix: 'c7ncd.request.chart'
  mainStore: StoreProps
  // // @ts-expect-error
  // formatRequestChart: IntlFormatters['formatMessage'],
  // // @ts-expect-error
  // formatCommon: IntlFormatters['formatMessage'],
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & RequestChartIndexProps;
