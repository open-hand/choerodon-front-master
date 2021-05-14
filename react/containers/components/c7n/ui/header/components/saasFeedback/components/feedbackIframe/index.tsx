import React, { useEffect } from 'react';

const IframeForm = (props:any) => {
  const {
    modal,
  } = props;

  function onMesCallback(e:any) {
    const data = e.data.success;
    if (data) {
      modal.close();
    }
  }

  useEffect(() => {
    window.addEventListener('message', onMesCallback, false);
  }, [onMesCallback]);

  // @ts-expect-error
  const getSrc = () => `http://192.168.17.180:81/feedback?token=b219a321-3961-44be-89ce-1cbe33cc06d2&parent=C7N&postMesDomain=${window._env_.API_HOST}`;

  return (
    <iframe
      id="test-feedback"
      name="test"
      src={getSrc()}
      width="100%"
      height="100%"
      frameBorder="0"
      marginWidth={0}
      style={{ margin: 0, padding: 0, display: 'block' }}
    />
  );
};

export default IframeForm;
