import { useLocalStore } from 'mobx-react-lite';

export default function useStore() {
  return useLocalStore(() => ({
    totalRequestChart: 0,
    setTotalRequestChart(value:any) {
      this.totalRequestChart = value;
    },
  }));
}

export type StoreProps = ReturnType<typeof useStore>;
