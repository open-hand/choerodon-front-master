import { datafluxRum } from '@zknow/utils';
import getMonitorEnable from '@/utils/getMonitorEnable';

const addAction = (actionName: string, data?: any) => {
  if (datafluxRum && actionName && getMonitorEnable()) {
    datafluxRum.addAction(actionName, data);
  }
};

export default addAction;
