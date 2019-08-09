import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import queryString from 'query-string';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { toJS } from 'mobx';
import { Button, Icon } from 'choerodon-ui';
import { Modal, Stores, Table, Select } from 'choerodon-ui/pro';
import { HEADER_TITLE_NAME } from '@choerodon/boot/lib/containers/common/constants';
import Store from '../../stores';
import findFirstLeafMenu from '../../../../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../../../../../common';
import { Action, Content, Header, Page, Permission, Breadcrumb } from '../../../../../../../index';

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
  fontSize: '14px',
  marginLeft: '.11rem',
};

const ListView = observer(({ handleClickProject, handleEditProject }) => {
  const { dataSet } = useContext(Store);

  function renderName({ record }) {
    return (
      <React.Fragment>
        <a
          role="none"
          onClick={() => handleClickProject(record)}
        >
          {record.get('name')}
        </a>
      </React.Fragment>
    );
  }

  function renderAction() {
    const actionDatas = [
      { service: [], icon: '', text: '编辑', action: handleEditProject },
    ];
    return <Action data={actionDatas} style={actionStyle} />;
  }

  return (
    <Table dataSet={dataSet}>
      <Column name="name" renderer={renderName} />
      <Column renderer={renderAction} width={100} />
      <Column name="code" />
      <Column name="appName" />
      <Column name="category" />
      <Column name="categoryGroup" />
      <Column name="createBy" />
      <Column name="creationDate" />
    </Table>
  );
});

export default ListView;
