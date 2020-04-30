import React, { useMemo } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Button, Icon } from 'choerodon-ui/pro';

import './index.less';

const Tips = withRouter(({ title, showLink, pathname, children, className, location: { search } }) => {
  function handleLink() {

  }

  return (
    <div className={`c7n-workbench-card ${className}`}>
      <div className="c7n-workbench-card-header">
        <span className="c7n-workbench-card-header-title">{title}</span>
        {showLink && pathname && (
          <Link
            to={{
              pathname,
              search,
            }}
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
};

Tips.defaultProps = {
  showLink: false,
};

export default injectIntl(Tips);
