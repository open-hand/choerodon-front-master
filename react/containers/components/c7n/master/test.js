import React from 'react';
import BrowserAdapter from '../../../../components/browser-adapter';

const Adapter = BrowserAdapter((props) => {
  console.log(props)
  const {
    user
  } = props;
  return (
    <div className="test-123">
      {user}
    </div>
  )
})({
  Chrome: () => import('./test.less')
});

export default () => <Adapter user={'isaac'} />;
