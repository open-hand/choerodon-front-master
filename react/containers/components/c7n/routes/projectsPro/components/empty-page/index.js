import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'choerodon-ui/pro';

import './index.less';

const EmptyPage = withRouter(((props) => {
  const {
    history,
    location: { search },
    pathname,
    title,
    describe,
    btnText,
    onClick,
  } = props;

  function handleClick() {
    history.push({
      pathname,
      search,
    });
  }

  return (
    <div className="allProjects-empty-page">
      <div className="allProjects-empty-page-image" />
      <div className="allProjects-empty-page-text">
        <div className="allProjects-empty-page-title">
          {title}
        </div>
        <div className="allProjects-empty-page-des">
          {describe}
        </div>
        {btnText && (
          <Button
            color="primary"
            onClick={onClick || handleClick}
            funcType="raised"
          >
            {btnText}
          </Button>
        )}
      </div>
    </div>
  );
}));

EmptyPage.propTypes = {
  pathname: PropTypes.string,
  access: PropTypes.bool,
  title: PropTypes.string,
  btnText: PropTypes.string,
  describe: PropTypes.string,
  onClick: PropTypes.func,
};

EmptyPage.defaultProps = {
  pathname: '',
  btnText: '',
};

export default EmptyPage;
