import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { DataSet, Lov } from 'choerodon-ui/pro';
import { withRouter } from 'react-router-dom';
import { Page, Content, Breadcrumb } from '../../../../../index';
import list from './list';
import OverflowText from '../../tools/overflow-text';
import './style/indexFun.less';

const ds = new DataSet({
  autoCreate: true,
  fields: [
    { name: 'code', type: 'object', lovCode: 'user', lovPara: { organization_id: 0 }, required: true },
  ],
});

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

  function renderLov() {
    return <Lov dataSet={ds} name="code" noCache />;
  }

  return (
    <Page>
      <Breadcrumb />
      <Content className="c7n-charts">
        {renderContentLinks()}
        {renderLov()}
        <OverflowText
          size="16px"
          lineHeight="20px"
          rowCount={2}
          text="上面的 root.error 和 root.warn 就分别是 ERROR 和WARNING 级别的日志。一般来说，我们使用
          ERROR（错误）、WARNING（警告）、INFO（信息）、DEBUG（调试信息）等名词来定义日志级别，优先级由高到低，然后我们在配置文件里配置一个最低打印优先级，低于这个优先级的日志都会被忽略不会打印，比如："
        />
      </Content>
    </Page>
  );
};

export default withRouter(Home);
