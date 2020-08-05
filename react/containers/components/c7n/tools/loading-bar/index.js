import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'choerodon-ui';
import classNames from 'classnames';
import './index.less';

const LoadingBarRequiredProps = {
  display: PropTypes.bool,
};

function LoadingBar({ display = false }) {
  const spinClass = classNames({
    'c7n-spin-hidden': !display,
    'c7n-spin-container': display,
  });
  return (
    <div className={spinClass}>
      <Progress type="loading" className="c7n-spin-container-progress" />
    </div>
  );
}

LoadingBar.propTypes = LoadingBarRequiredProps;

export default LoadingBar;
