//
import React, {
  useMemo, useEffect, useState, useCallback, useRef,
} from 'react';
import isOverflow from 'choerodon-ui/pro/lib/overflow-tip/util';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import {
  Button, Modal, ModalProvider, Tooltip,
} from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import Tabs from 'rc-tabs';
import {
  Droppable, Draggable, DragDropContext,
} from 'react-beautiful-dnd';
import classnames from 'classnames';

import CreateViewDrawer from '../CreateViewDrawer';
import WorkBenchDashboard from '../../../../components/WorkBenchDashboard';
import { useWorkBenchStore } from '../../../../stores';
// import Store from './stores';
import styles from './index.less';
import './style/index.less';

const { TabPane } = Tabs;
const modalKey = Modal.key();

const reorder = (viewDs, startIndex, endIndex) => {
  const result = Array.from(viewDs.records);
  const [removed] = result.splice(startIndex, 1);
  viewDs.splice(endIndex, 0, removed);
  return result;
};

const WorkBenchTabs = observer(() => {
  const {
    workBenchUseStore,
    prefixCls,
    viewDs,
    history,
    location: { search },
  } = useWorkBenchStore();

  const [canDrag, setCanDrag] = useState(false);
  const originOrder = useRef([]);

  useEffect(() => {
    processDataSetListener(true);
    return () => {
      processDataSetListener(false);
    };
  }, []);

  const processDataSetListener = (flag) => {
    if (viewDs) {
      const handler = flag ? viewDs.addEventListener : viewDs.removeEventListener;
      handler.call(viewDs, 'load', handleLoading);
    }
  };

  const handleLoading = () => {
    if (viewDs.length) {
      originOrder.current = viewDs.map((record) => record.get('dashboardId'));
      const { dashboardId } = queryString.parse(search);
      let currentDashboardId;
      if (workBenchUseStore.activeTabKey) {
        currentDashboardId = workBenchUseStore.activeTabKey;
      } else if (dashboardId && viewDs.find((record) => record.get('dashboardId') === dashboardId)) {
        currentDashboardId = dashboardId;
      } else {
        currentDashboardId = viewDs.current.get('dashboardId');
      }
      workBenchUseStore.setActiveTabKey(currentDashboardId);
      viewDs.locate(viewDs.findIndex((r) => r.get('dashboardId') === currentDashboardId));
    }
  };

  const handleAdd = () => {
    Modal.open({
      title: '创建布局视图',
      key: modalKey,
      drawer: true,
      children: <CreateViewDrawer search={search} viewDs={viewDs} onCreateCustomView={handleCreateCustomView} />,
      destroyOnClose: true,
      okText: '创建',
    });
  };

  const handleCreateCustomView = (dashboardId) => {
    workBenchUseStore.setActiveTabKey(dashboardId);
  };

  const handleSet = () => {
    setCanDrag(!canDrag);
  };

  const handleSave = async () => {
    const removedRecords = viewDs.destroyed;
    if (removedRecords.length > 0) {
      const res = await viewDs.submit();
      if (res && !res.failed) {
        rankViews();
      }
    } else {
      const currentOrder = viewDs.map((record) => record.get('dashboardId'));
      if (currentOrder.join('&') !== originOrder.current.join('&')) {
        rankViews();
      } else {
        setCanDrag(false);
      }
    }
  };

  const rankViews = async () => {
    const rankRes = await workBenchUseStore.rankDashboard(viewDs.toData());
    if (rankRes && !rankRes.failed) {
      setCanDrag(false);
      const nextRankRes = {};
      rankRes.forEach((item) => {
        nextRankRes[item.dashboardId] = item.objectVersionNumber;
      });
      viewDs.forEach((record) => record.set('objectVersionNumber', nextRankRes[record.get('dashboardId')]));
      viewDs.query();
    }
  };

  const handleCancel = () => {
    setCanDrag(false);
    viewDs.reset();
  };

  /**
   * 删除视图
   */
  const handleRemoveView = async (record) => {
    // const res = await viewDs.delete(record, {
    //   okText: '删除',
    //   title: '删除视图',
    //   children: `确认删除视图${record.get('dashboardName')}吗?`,
    //   type: 'warning',
    //   okProps: { color: 'red' },
    //   cancelProps: { color: 'dark' },
    // });
    viewDs.remove(record);
    if (viewDs.length) {
      // 删除后还有视图，则定位到第一个
      const firstRecord = await viewDs.first();
      workBenchUseStore.setActiveTabKey(firstRecord.get('dashboardId'));
    } else {
      // 删除后没有视图了显示空白图片
      workBenchUseStore.setActiveTabKey(null);
    }
  };

  const redirectToEdit = (record) => {
    const { dashboardId, dashboardName } = record.toData();
    let searchParams = queryString.parse(search);
    searchParams = { ...searchParams, dashboardId, dashboardName };
    history.push({
      pathname: '/workbench/edit',
      search: `?${queryString.stringify(searchParams)}`,
    });
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    reorder(
      viewDs,
      result.source.index,
      result.destination.index,
    );
  };

  const getItemStyle = (isDragging, draggableStyle, enabled) => ({
    userSelect: 'none',
    ...draggableStyle,
    top: isDragging ? 0 : 'unset',
    borderleft: isDragging ? '2px solid #d9e6f2' : 'inherit',
    cursor: enabled ? 'all-scroll' : 'not-allowed',
  });

  // const getListStyle = (isDraggingOver) => ({
  //   border: isDraggingOver ? '2px dotted #5266d4' : 'none',
  //   borderRadius: isDraggingOver ? '3px' : '0',
  //   // padding: isDraggingOver ? '4px' : 0,
  //   background: isDraggingOver ? 'rgba(82, 102, 212, 0.1)' : 'none',
  // });

  const onChangeTab = useCallback((key) => {
    workBenchUseStore.setActiveTabKey(key);
    workBenchUseStore.setActiveStarProject(null); // TODO:避免多个面板添加了星标卡片互相影响,需求变化需改为存储Map
    viewDs.locate(viewDs.findIndex((r) => r.get('dashboardId') === key));
  }, []);

  const renderTabPanes = () => viewDs.map((record) => (
    <TabPane
      tab={(
        <>
          <Tooltip title={record.get('dashboardName')}>
            <span
              className={styles['tabpane-title']}
              onMouseEnter={(e) => {
                const { currentTarget } = e;
                if (isOverflow(currentTarget)) {
                  Tooltip.show(currentTarget, {
                    title: record.get('dashboardName'),
                  });
                }
              }}
              onMouseLeave={Tooltip.hide}
            >
              {record.get('dashboardName')}
            </span>
          </Tooltip>
          {canDrag && <Icon type="delete_forever-o" onClick={() => handleRemoveView(record)} />}
          {canDrag && <Icon type="baseline-drag_indicator" />}
          {(!canDrag && record.get('dashboardType') === 'CUSTOMIZE') && <Icon type="edit-o" onClick={() => redirectToEdit(record)} />}
        </>
      )}
      key={record.get('dashboardId')}
    />
  ));

  const renderDefaultTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props}>
      {(node) => node}
    </DefaultTabBar>
  );

  const renderDragTabBar = (props, DefaultTabBar) => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="dropTabsStep"
        direction="horizontal"
        isCombineEnabled={false}
      >
        {
          (provided, snapshot) => (
            <div
              className={styles['droppable-wrapper']}
              ref={provided.innerRef}
            >
              <DefaultTabBar {...props}>
                {(node) => (
                  <Draggable key={`tabpane-${node.key}`} draggableId={`tabpane-${node.key}`} index={Number(viewDs.findIndex((record) => record.get('dashboardId') === node.key))}>
                    {
                      (draggableProvided, draggableSnapshot) => {
                        const itemClassName = classnames(styles['draggable-items'], {
                          // [styles['draggable-items-dragging']]: snapshotinner.isDragging,
                          [styles['draggable-items-active']]: node.key === workBenchUseStore.activeKey,
                          // [styles['draggable-items-last']]: props.panes[panesNums - 1].key === node.key,
                        });
                        return (
                          <div
                            // onClick={() => {
                            //   if (p.enabled) {
                            //     ProjectsProUseStore.handleClickProject(p);
                            //   }
                            // }}
                            className={itemClassName}
                            role="none"
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            style={getItemStyle(
                              draggableSnapshot.isDragging,
                              draggableProvided.draggableProps.style,
                              // p.enabled,
                              // true,
                            )}
                          >
                            {node}
                          </div>
                        );
                      }
                    }
                  </Draggable>
                )}
              </DefaultTabBar>
              {/* {provided.placeholder} */}
            </div>
          )
        }
      </Droppable>
    </DragDropContext>
  );

  const renderTabButtons = useMemo(() => {
    if (canDrag) {
      return (
        <div className={styles['tabs-buttons']}>
          <Button
            onClick={handleCancel}
            icon="close"
          />
          <Button onClick={handleSave} icon="done" style={{ background: '#5365EA', color: '#fff' }} />
        </div>
      );
    }

    return (
      <ModalProvider>
        <div className={styles['tabs-buttons']}>
          <Button onClick={handleAdd} icon="add" />
          <Button onClick={handleSet} icon="settings-o" />
        </div>
      </ModalProvider>
    );
  }, [canDrag]);

  return (
    <div className={styles['workbench-tabs']}>
      <Tabs
        animated={false}
        activeKey={workBenchUseStore.activeTabKey}
        onChange={onChangeTab}
        renderTabBar={canDrag ? renderDragTabBar : renderDefaultTabBar}
        tabBarExtraContent={renderTabButtons}
      >
        {renderTabPanes()}
      </Tabs>
    </div>
  );
});

export default WorkBenchTabs;
