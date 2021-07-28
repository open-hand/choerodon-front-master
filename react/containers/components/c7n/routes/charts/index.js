import React, { useState, useEffect, useCallback } from 'react';
import sortBy from 'lodash/sortBy';
import { inject } from 'mobx-react';
import { mount } from '@choerodon/inject';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../../tools/page/Header';
import Page from '../../tools/page';
import Content from '../../tools/page/Content';
import Breadcrumb from '../../tools/tab-page/Breadcrumb';
import axios from '../../tools/axios';

import './style/index.less';

const Home = (props) => {
  const [list, setList] = useState([]);
  const {
    AppState, reportType, service, showCreate = false, extraCharts = [],
  } = props;

  const { search } = useLocation();
  const history = useHistory();

  useEffect(() => {
    async function loadLists() {
      const res = await axios.get(`/iam/choerodon/v1/projects/${AppState.currentMenuType.id}/report/list/${reportType}`);
      setList(res);
    }
    loadLists();
  }, [reportType]);

  const handleClickItem = useCallback((report) => {
    history.push(`${report.path}${search}`);
  }, [search]);

  const renderGroup = useCallback((chart) => (
    <div
      key={chart.key}
      className="c7n-item"
      role="none"
      onClick={() => handleClickItem(chart)}
    >
      <div className="c7n-item-pic">
        <img src={chart.icon} alt="" />
      </div>
      <div className="c7n-item-word">
        <h4 className="c7n-item-title">{chart.title}</h4>
        <p className="c7n-item-des">{chart.description}</p>
      </div>
    </div>
  ), [handleClickItem]);

  return (
    <Page service={service}>
      <Header>
        {showCreate && (
        <>
          {mount('agile:AgileChartHeaderButtons', {})}
        </>
        )}
      </Header>
      <Breadcrumb />
      <Content className="c7n-charts">
        <div className="line">
          <div className="line-content">
            {[...sortBy(list, 'sort'), ...extraCharts].map((chart) => renderGroup(chart))}
          </div>
        </div>
      </Content>
    </Page>
  );
};

Home.propTypes = {
  reportType: PropTypes.oneOf(['agile', 'develop', 'deploy']).isRequired,
  service: PropTypes.arrayOf(PropTypes.string),
};

Home.defaultProps = {
  service: [],
};

export default inject('AppState')(Home);
