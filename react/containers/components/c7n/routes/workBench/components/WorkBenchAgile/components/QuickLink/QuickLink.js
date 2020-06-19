import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Icon } from "choerodon-ui";
import { observer } from 'mobx-react-lite';
import Action from "@/containers/components/c7n/tools/action";
import emptyImage from '../../../../../../../../images/owner.png';
import { Modal, Form, SelectBox, Select, TextField } from 'choerodon-ui/pro';
import HeaderStore from '../../../../../../../../stores/c7n/HeaderStore';
import AddQuickLink from "./AddQuickLink";
import { useWorkBenchStore } from "../../../../stores";
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

  const {
    workBenchUseStore,
  } = useWorkBenchStore();

  const init = () => {
    let id;
    if (workBenchUseStore.getActiveStarProject) {
      id = workBenchUseStore.getActiveStarProject.id;
    }
    quickLinkUseStore.axiosGetQuickLinkList(id);
  }

  useEffect(() => {
    init();
  }, [workBenchUseStore.getActiveStarProject]);

  const handleAdd = useCallback((data) => {
    Modal.open({
      key: Modal.key(),
      title: data ? '修改链接' : '添加链接',
      style: {
        width: 380,
      },
      children:  <AddQuickLink data={data} useStore={quickLinkUseStore} dataSet={AddLinkDataSet} workBenchUseStore={workBenchUseStore} />,
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
                Modal.confirm({
                  title: '提示',
                  children: '确认删除?',
                  type: 'warning',
                }).then(() => {
                  quickLinkUseStore.axiosDeleteQuickLink(l.id);
                })
              }
            }]} />
          </div>
        </div>
      </div>
    ))
  }

  const handleLoadMore = () => {
    const originSize = quickLinkUseStore.getParams.size;
    quickLinkUseStore.setParams({
      size: originSize + 10,
      hasMore: false,
    });
    init();
  }

  return (
    <div className="c7n-quickLink">
      <div className="c7n-quickLink-title">
        快速链接
        <Icon onClick={() => handleAdd()} type="playlist_add" />
      </div>
      {
        quickLinkUseStore.getQuickLinkList.length > 0 ? [
          renderLinks(),
          quickLinkUseStore.getParams.hasMore && <a onClick={() => handleLoadMore()}>加载更多</a>
        ] : (
          <div className="c7n-quickLink-empty">
            <div className="c7n-quickLink-empty-container">
              <p className="c7n-quickLink-empty-container-text1">暂无快速链接</p>
              <p className="c7n-quickLink-empty-container-text2">暂无快速链接，请创建</p>
              <img style={{ width: 220 }} src={emptyImage} alt=""/>
            </div>
          </div>
        )
       }
    </div>
  )
});

export default QuickLink;
