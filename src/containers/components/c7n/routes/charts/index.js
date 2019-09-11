import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { withRouter } from 'react-router-dom';
import { Page, Content, Breadcrumb } from '../../../../../index';
import list from './list';
import './style/indexFun.less';

const Home = (props) => {
  function handleClickItem(report) {
    const { history } = props;
    // const urlParams = AppState.currentMenuType;
    // const { type, id, name, organizationId } = urlParams;
    // history.push(`${report.link}?type=${type}&id=${id}&name=${name}&organizationId=${organizationId}`);
  }

  function renderGroup(chart) {
    return (
      <div
        key={chart.key}
        className="c7n-item"
        role="none"
        onClick={handleClickItem.bind(this, chart)}
      >
        <div className={`c7n-item-pic ${chart.pic}`} />
        <div className="c7n-item-word">
          <h4 className="c7n-item-title">{chart.title}</h4>
          <p className="c7n-item-des">{chart.description}</p>
        </div>
      </div>
    );
  }

  function renderContentLinks() {
    const groupArr = groupBy(list, 'report_type');
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

export default withRouter(Home);
