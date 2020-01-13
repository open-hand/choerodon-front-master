import React, { useContext, useEffect } from 'react';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import { Table, Select } from 'choerodon-ui/pro';
import Store from './stores';
import { Content, Page } from '../../../../../index';
import InRowTable from './InRowTable';
import getSearchString from '../../util/gotoSome';
import './style/index.less';

const { Option } = Select;
const { Column } = Table;

const ListView = observer(() => {
  const context = useContext(Store);
  const { dataSet, type, changeType, history, HeaderStore, getDs, AppState } = context;

  function goto(record) {
    const search = getSearchString('project', 'id', record.get('projectId'));
    history.push(`/base/application-management${search}`);
  }

  function handleOnCell({ record }) {
    return {
      onClick: () => {
        record.set('expandField', !record.get('expandField'));
      },
    };
  }

  function handleChangeType(value) {
    changeType(value);
    dataSet.setQueryParameter('participant', undefined);
    dataSet.setQueryParameter('created_by', undefined);
    dataSet.setQueryParameter('type', undefined);
    dataSet.setQueryParameter('all', undefined);
    if (value === 'join') {
      dataSet.setQueryParameter('participant', AppState.getUserId);
    } else if (value === 'create') {
      dataSet.setQueryParameter('created_by', AppState.getUserId);
    } else if (value === 'market') {
      dataSet.setQueryParameter('type', 'market');
    } else if (value === 'all') {
      dataSet.setQueryParameter('all', true);
      dataSet.setQueryParameter('type', 'market');
      dataSet.setQueryParameter('participant', AppState.getUserId);
    }
    dataSet.query();
  }

  useEffect(() => {
    handleChangeType(type);
  }, []);

  function renderHeader() {
    const { organizationId } = queryString.parse(history.location.search);
    const org = (HeaderStore.getOrgData || []).find(v => String(v.id) === organizationId) || { name: '' };
    return (
      <div className="c7n-projects-header">
        <div className="c7n-projects-title">{`${org.name}中的应用`}</div>
      </div>
    );
  }

  function renderTool() {
    return (
      <div className="c7n-projects-tool">
        <Select labelLayout="float" label="应用" clearButton={false} value={type} onChange={handleChangeType} style={{ width: 260 }}>
          <Option key="join" value="join">我参与的</Option>
          <Option key="create" value="create">我创建的</Option>
          <Option key="market" value="market">来自应用市场</Option>
          <Option key="all" value="all">全部</Option>
        </Select>
      </div>
    );
  }

  function renderName({ record }) {
    return <span className="name-column">{record.get('name')}</span>;
  }

  function renderProjectName({ record }) {
    return (
      <span
        className="link"
        onClick={() => goto(record)}
        role="none"
      >
        {record.get('projectName')}
      </span>
    );
  }

  return (
    <Page>
      {renderHeader()}
      <Content>
        {renderTool()}
        <Table expandedRowRenderer={InRowTable.bind(this, getDs)} dataSet={dataSet} className="c7n-app-table">
          <Column name="name" width={300} renderer={renderName} onCell={handleOnCell} />
          <Column name="description" />
          <Column name="projectName" renderer={renderProjectName} />
          <Column name="creatorRealName" />
          <Column name="creationDate" />
        </Table>
      </Content>
    </Page>
  );
});

export default ListView;
