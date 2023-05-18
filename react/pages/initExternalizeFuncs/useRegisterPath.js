import React, {
  useEffect, useMemo,
} from 'react';
import ExternalComponent from '@/components/external-component';
import useExternalFunc from '@/hooks/useExternalFunc';

const demo = (props) => (
  <ExternalComponent system={{ scope: 'agile', module: 'backlog:demandDetail' }} {...props} />
);

const useRegisterPath = (props) => {
  const { loading, func: registerPath } = useExternalFunc('agile', 'agile:registerPath');

  useEffect(() => {
    if (!loading && registerPath?.default) {
      registerPath.default({
        path: 'demand',
        // component: ,
        component: demo,
      });
    }
  }, [loading, registerPath]);
};

export default useRegisterPath;
