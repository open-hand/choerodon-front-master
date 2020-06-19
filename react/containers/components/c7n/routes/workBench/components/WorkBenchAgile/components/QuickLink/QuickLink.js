import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Icon } from "choerodon-ui";
import { observer } from 'mobx-react-lite';
import Action from "@/containers/components/c7n/tools/action";
import { Modal, Form, SelectBox, Select, TextField } from 'choerodon-ui/pro';
import HeaderStore from '../../../../../../../../stores/c7n/HeaderStore';
import AddQuickLink from "./AddQuickLink";
import TimePopover from "@/containers/components/c7n/routes/workBench/components/time-popover";
import { useQuickLinkStore } from "./stores";
import './index.less';

const QuickLink = observer(() => {
  const [links, setLinks] = useState([{
    name: '李丹丹',
    day: '2天前',
    project: '基础架构管理-区块链中台研发',
    linkName: 'Choerodon-UI图 蓝湖地址',
  }])

  const {
    AddLinkDataSet,
    quickLinkUseStore,
  } = useQuickLinkStore();

  useEffect(() => {
    quickLinkUseStore.axiosGetQuickLinkList();
  }, []);


  const handleAdd = useCallback((data) => {
    Modal.open({
      key: Modal.key(),
      title: data ? '修改链接' : '添加链接',
      style: {
        width: 380,
      },
      children:  <AddQuickLink data={data} useStore={quickLinkUseStore} dataSet={AddLinkDataSet} />,
      drawer: true,
      okText: '添加',
    })
  }, [AddLinkDataSet.current.get('scope')])

  const renderLinks = () => {
    return quickLinkUseStore.getQuickLinkList.map(l => (
      <div className="c7n-quickLink-linkItem">
        <div className="c7n-quickLink-linkItem-left">
          <p className="c7n-quickLink-linkItem-left-name">{l.user.realName}</p>
          <p className="c7n-quickLink-linkItem-left-time">
            <TimePopover datetime={l.creationDate} />
          </p>
        </div>
        <div className="c7n-quickLink-linkItem-circle" />
        <div className="c7n-quickLink-linkItem-right">
          <div
            className="c7n-quickLink-linkItem-right-profile"
            style={{
              backgroundImage: `url(${l.user.imageUrl})`
            }}
          />
          <div className="c7n-quickLink-linkItem-right-content">
            <div>
              <p className="c7n-quickLink-linkItem-right-content-scope">{l.scope === 'project' ? '项目可见' : '仅自己可见'}</p>
              <p>{l.name}</p>
            </div>
            <p onClick={() => window.open(l.linkUrl)} className="c7n-quickLink-linkItem-right-content-linkName"><Icon style={{ color: '#5266D4' }} type="link2" />{l.linkUrl}</p>
          </div>
          <div>
            <Action data={[{
              service: [],
              icon: '',
              text: '修改',
              action: () => {
                handleAdd(l)
              }
            }, {
              service: [],
              icon: '',
              text: '删除',
              action: () => {
                quickLinkUseStore.axiosDeleteQuickLink(l.id);
              }
            }]} />
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="c7n-quickLink">
      <div className="c7n-quickLink-title">
        快速链接
        <Icon onClick={() => handleAdd()} type="playlist_add" />
      </div>
      {renderLinks()}
    </div>
  )
});

export default QuickLink;
