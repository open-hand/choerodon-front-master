import React, { useState, useEffect } from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Page, Content, Breadcrumb, axios } from '../../../../../index';
import './style/index.less';

const Home = (props) => {
  const [list, setList] = useState([]);
  const { history, AppState } = props;

  useEffect(() => {
    async function loadLists() {
      const res = await axios.get(`/base/v1/projects/${AppState.currentMenuType.id}/report/list`);
      setList(res);
    }
    loadLists();
  }, []);

  function handleClickItem(report) {
    const urlParams = AppState.currentMenuType;
    const { type, id, name, organizationId, category } = urlParams;
    history.push(`${report.path}?type=${type}&id=${id}&name=${name}&organizationId=${organizationId}&category=${category}`);
  }

  function renderGroup(chart) {
    return (
      <div
        key={chart.key}
        className="c7n-item"
        role="none"
        onClick={handleClickItem.bind(this, chart)}
      >
        <div className="c7n-item-pic">
          <img src={chart.icon} alt="" />
        </div>
        <div className="c7n-item-word">
          <h4 className="c7n-item-title">{chart.title}</h4>
          <p className="c7n-item-des">{chart.description}</p>
        </div>
      </div>
    );
  }

  function renderContentLinks() {
    const groupArr = groupBy(list, 'reportType');
    const keyArr = Object.keys(groupArr);
    const len = keyArr.length;
    return keyArr.map((groupName, i) => (
      <div className="line" style={{ borderBottom: `${i !== len - 1 ? '1px solid #d8d8d8' : 'none'}` }}>
        <div className="line-title">{groupName}</div>
        <div className="line-content">
          {sortBy(groupArr[groupName], 'sort').map(chart => renderGroup(chart))}
        </div>
      </div>
    ));
  }

  return (
    <Page>
      <Breadcrumb />
      <Content className="c7n-charts">
        {renderContentLinks()}
      </Content>
    </Page>
  );
};

export default inject('AppState')(withRouter(Home));
