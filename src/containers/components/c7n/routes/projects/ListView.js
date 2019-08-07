import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import queryString from 'query-string';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { toJS } from 'mobx';
import { Button, Icon } from 'choerodon-ui';
import { Modal, Stores, Table, Select } from 'choerodon-ui/pro';
import { HEADER_TITLE_NAME } from '@choerodon/boot/lib/containers/common/constants';
import Store from './stores';
import List from './List';
import findFirstLeafMenu from '../../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../../../common';
import { Action, Content, Header, Page, Permission, Breadcrumb } from '../../../../../index';
import './style/index.less';

const { Column } = Table;
const { Option } = Select;
const modalKey = Modal.key();

const modalStyle = {
  width: 'calc(100vw - 350px)',
};
const contentStyle = {
  width: 512,
  padding: 0,
  overflowX: 'hidden',
};
const actionStyle = {
  marginRight: 10,
};
const iconStyle = {
  fontSize: '16px',
  marginLeft: '.11rem',
};

const ListView = observer(() => {
  const {
    dataSet, AppState, showType, toggleShowType,
    HeaderStore, MenuStore, history,
  } = useContext(Store);

  useEffect(() => {
    const { orgId } = queryString.parse(history.location.search);
    const proData = HeaderStore.getProData || [];
    const pros = proData.filter(v => String(v.organizationId) === orgId);
    dataSet.loadData(toJS(pros));
  }, []);

  function handleClickProject() {
    const record = dataSet.current;
    const { id, name, type, organizationId, category } = record.toData();
    MenuStore.loadMenuData({ type, id }, false).then((menus) => {
      let route;
      let path;
      let domain;
      if (menus.length) {
        const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
        route = menuRoute;
        domain = menuDomain;
      }
      if (route) {
        path = `/?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
        if (organizationId) {
          path += `&organizationId=${organizationId}&orgId=${organizationId}`;
        }
      }
      if (path) {
        historyPushMenu(history, path, domain);
      }
    });
  }

  function renderTool() {
    return (
      <div className="c7n-projects-tool">
        <Select label="项目" clearButton={false}>
          <Option>最近使用</Option>
          <Option>全部项目</Option>
        </Select>
        <div className="c7n-projects-tool-icon-group">
          <Icon type="dashboard" style={iconStyle} className={showType === 'block' ? 'active' : null} onClick={() => toggleShowType('block')} />
          <Icon type="format_list_bulleted" style={iconStyle} className={showType === 'table' ? 'active' : null} onClick={() => toggleShowType('table')} />
        </div>
      </div>
    );
  }

  return (
    <Page>
      <Header>
        <Button icon="refresh">创建项目</Button>
      </Header>
      <Breadcrumb title="项目" />
      <Content>
        {renderTool()}
        <List />
      </Content>
    </Page>
  );
});

export default ListView;
