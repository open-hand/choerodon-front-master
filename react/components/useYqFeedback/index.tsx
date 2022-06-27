import React, { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    initSDK();
  }, []);

  const initSDK = () => {
    const flag = document.querySelector('.yq-feedback');
    // eslint-disable-next-line
    if (!flag && window._env_.YQ_FEEDBACK_SDK) {
      const script = document.createElement('script');
      // eslint-disable-next-line
      script.src = window._env_.YQ_FEEDBACK_SDK;
      script.async = true;
      document.body.appendChild(script);
    }
  };
};

export default Index;
