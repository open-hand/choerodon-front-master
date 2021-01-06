import React, { useMemo } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Button, Icon } from 'choerodon-ui/pro';

import './index.less';

const Tips = withRouter(({
  title, showLink, pathname, children, className, location: { search }, showCount, count, style,
}) => {
  function handleLink() {

  }

  return (
    <div className={`c7n-workbench-card ${className}`} style={style}>
      <div className="c7n-workbench-card-header">
        <span className="c7n-workbench-card-header-title">{title}</span>
        {showCount && count ? (
          <span className="c7n-workbench-card-header-count">{count}</span>
        ) : null}
        {showLink && pathname && (
          <Link
            to={{
              pathname,
              search,
            }}
            className="c7n-workbench-card-header-link"
          >
            <Icon type="trending_flat" />
          </Link>
        )}
      </div>
      <div className="c7n-workbench-card-content">
        {children}
      </div>
    </div>
  );
});

Tips.propTypes = {
  title: PropTypes.string.isRequired,
  showLink: PropTypes.bool,
  pathname: PropTypes.string,
  className: PropTypes.string,
  showCount: PropTypes.bool,
  count: PropTypes.number,
};

Tips.defaultProps = {
  showLink: false,
  showCount: false,
  count: 0,
};

export default injectIntl(Tips);
