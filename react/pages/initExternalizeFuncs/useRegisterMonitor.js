import {
  useEffect,
} from 'react';
import useExternalFunc from '@/hooks/useExternalFunc';

const useRegisterMonitor = (props) => {
  const { loading, func: registerMonitor } = useExternalFunc('basePro', 'base-pro:registerMonitor');

  useEffect(() => {
    if (!loading && registerMonitor?.default) {
      registerMonitor.default();
    }
  }, [loading, registerMonitor]);
};

export default useRegisterMonitor;
