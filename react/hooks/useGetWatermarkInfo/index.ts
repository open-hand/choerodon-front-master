import stores from '@/containers/stores';

const { AppState } = stores;

interface WatermarkInfoProps {
  enable?: boolean,
  waterMarkString?: string,
}

const useGetWatermarkInfo = (): WatermarkInfoProps | null => AppState.getWatermarkInfo;

export default useGetWatermarkInfo;
