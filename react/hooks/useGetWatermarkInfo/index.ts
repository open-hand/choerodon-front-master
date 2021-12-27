import AppState from '@/containers/stores/c7n/AppState';

interface WatermarkInfoProps {
  enable?: boolean,
  waterMarkString?: string,
}

const useGetWatermarkInfo = (): WatermarkInfoProps | null => AppState.getWatermarkInfo;

export default useGetWatermarkInfo;
