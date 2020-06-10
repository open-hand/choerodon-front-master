import React, { useState } from 'react';
import { Icon } from "choerodon-ui";
import { Modal, Form, SelectBox, Select, TextField } from 'choerodon-ui/pro';
import { useQuickLinkStore } from "./stores";
import './index.less';

const { Option } = Select;

const QuickLink = () => {
  const [links, setLinks] = useState([{
    name: '李丹丹',
    day: '2天前',
    project: '基础架构管理-区块链中台研发',
    linkName: 'Choerodon-UI图 蓝湖地址',
  }])

  const {
    AddLinkDataSet
  } = useQuickLinkStore();

  const handleAdd = () => {
    Modal.open({
      key: Modal.key(),
      title: '添加链接',
      style: {
        width: 380,
      },
      children: (
        <Form dataSet={AddLinkDataSet}>
          <SelectBox name="ljgkfw">
            <Option value="xmkj">项目可见</Option>
            <Option value="jzjkj">仅自己可见</Option>
          </SelectBox>
          <Select name="xm">
            <Option value="cxjf">Choerodon持续交付</Option>
          </Select>
          <TextField name="ljmc" />
          <TextField name="ljdz" />
        </Form>
      ),
      drawer: true,
      okText: '添加',
    })
  }

  const renderLinks = () => {
    return links.map(l => (
      <div className="c7n-quickLink-linkItem">
        <div className="c7n-quickLink-linkItem-left">
          <p className="c7n-quickLink-linkItem-left-name">{l.name}</p>
          <p className="c7n-quickLink-linkItem-left-time">{l.day}</p>
        </div>
        <div className="c7n-quickLink-linkItem-circle" />
        <div className="c7n-quickLink-linkItem-right">
          <div className="c7n-quickLink-linkItem-right-profile" />
          <div className="c7n-quickLink-linkItem-right-content">
            <p className="c7n-quickLink-linkItem-right-content-project">{l.project}</p>
            <p className="c7n-quickLink-linkItem-right-content-linkName">{l.linkName}<Icon style={{ color: '#5266D4' }} type="link2" /></p>
          </div>
          <div>
            <Icon type="more_vert" />
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="c7n-quickLink">
      <div className="c7n-quickLink-title">
        快速链接
        <Icon onClick={handleAdd} type="playlist_add" />
      </div>
      {renderLinks()}
    </div>
  )
}

export default QuickLink;
