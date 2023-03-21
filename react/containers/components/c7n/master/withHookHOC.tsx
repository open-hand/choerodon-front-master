import React from 'react';
import useExternalFunc from '@/hooks/useExternalFunc';

const withHooksHOC = (Component: any) => (props: any) => {
  const { func: handleGetHelpDocUrl } = useExternalFunc('basePro', 'base-pro:handleGetHelpDocUrl');
  const { func: getSaaSUserRestDays } = useExternalFunc('basePro', 'base-pro:getSaaSUserRestDays');

  return (
    <Component
      handleGetHelpDocUrl={handleGetHelpDocUrl}
      getSaaSUserRestDays={getSaaSUserRestDays}
      {...props}
    />
  );
};

export default withHooksHOC;
