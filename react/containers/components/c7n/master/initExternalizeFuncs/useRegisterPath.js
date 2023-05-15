import React, {
  useEffect,
} from 'react';
import ExternalComponent from '@/components/external-component';
import useExternalFunc from '@/hooks/useExternalFunc';

const useRegisterPath = (props) => {
  const { loading, func: registerPath } = useExternalFunc('agile', 'agile:registerPath');

  useEffect(() => {
    if (!loading && registerPath?.default) {
      registerPath.default({
        path: 'demand',
        component: <ExternalComponent system={{ scope: 'agile', module: 'backlog:demandDetail' }} />,
      });
    }
  }, [loading, registerPath]);
};

export default useRegisterPath;
