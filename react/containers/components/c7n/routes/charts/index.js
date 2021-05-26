import React, { useState, useEffect, useCallback } from 'react';
import sortBy from 'lodash/sortBy';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Page, Content, Breadcrumb, axios,
} from '../../../../../index';
import './style/index.less';

const Home = (props) => {
  const [list, setList] = useState([]);
  const {
    history, location: { search }, AppState, reportType = 'develop',
  } = props;

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
    <Page>
      <Breadcrumb />
      <Content className="c7n-charts">
        <div className="line">
          <div className="line-content">
            {sortBy(list, 'sort').map((chart) => renderGroup(chart))}
          </div>
        </div>
      </Content>
    </Page>
  );
};

export default inject('AppState')(withRouter(Home));
