import React from 'react';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button } from 'choerodon-ui';
import './404.less';
import { HOMEPAGE_PATH } from '@/constants';

const NoMatch = ({ button = true }) => (
  <div className="c7n-404-page">
    <div className="c7n-404-page-banner" />
    <div className="c7n-404-page-banner-text">
      <span>抱歉 ，您访问的页面不存在！</span>
      {button && (
      <Link to={HOMEPAGE_PATH}>
        <Button funcType="raised" type="default">
          返回首页
        </Button>
      </Link>
      )}
    </div>
  </div>
);

export default inject('MenuStore')(NoMatch);
