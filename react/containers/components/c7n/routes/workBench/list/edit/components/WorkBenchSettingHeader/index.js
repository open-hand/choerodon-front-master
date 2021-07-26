// 配置自定义视图
import React, { useEffect, useRef } from 'react';
import {
  Icon, TextField, Select, Button, Modal,
} from 'choerodon-ui/pro';
import {
  get, map, forEach, filter,
} from 'lodash';
import queryString from 'query-string';
import AddModal from '@/containers/components/c7n/components/addComponentsModal';
import { useWorkBenchStore } from '../../../../stores';
// import mappings from '../../../../stores/mappings';
import styles from './index.less';

const WorkBenchSettingHeader = () => {
  const {
    prefixCls,
    AppState: { getUserInfo },
    editHeaderDs,
    dashboardDs,
    allowedModules,
    workBenchUseStore,
    addCardDs,
    history,
    location: { search },
  } = useWorkBenchStore();

  useEffect(() => {
    const { dashboardName, dashboardId } = queryString.parse(search);
    editHeaderDs.current.set('dashboardName', dashboardName);
    editHeaderDs.current.set('dashboardId', dashboardId);
  }, [editHeaderDs, search]);

  const { current: setPrefixCls } = useRef(`${prefixCls}-setting`);

  function addComponent(newTypeArr, deleteArr) {
    const existData = map(dashboardDs.filter((record) => !deleteArr.includes(record.get('i'))), (record) => record.toData());
    forEach(newTypeArr, (type) => {
      const { layout, ...rest } = addCardDs.find((record) => record.get('type') === type).toData();
      const tempCp = {
        ...layout,
        ...rest,
        x: 0,
        y: Infinity,
      };
      existData.push(tempCp);
    });
    dashboardDs.loadData(existData);
  }

  function openAddComponents() {
    const subPrefix = 'c7ncd-workbench-addModal';
    const typeArr = map(dashboardDs.toData(), (item) => get(item, 'i'));
    Modal.open({
      title: '添加卡片',
      key: Modal.key(),
      drawer: true,
      style: {
        width: '740px',
      },
      contentStyle: { padding: 0 },
      children: <AddModal
        subPrefix={subPrefix}
        existTypes={typeArr}
        addComponent={addComponent}
        mappings={addCardDs.toData()}
      />,
      className: `${subPrefix}`,
    });
  }

  function handleSave() {
    const tempData = dashboardDs.toData();
    const { dashboardName, dashboardId } = editHeaderDs.current.toData();
    const dashboardLayoutS = tempData.map((item) => {
      const { layoutId, ...rest } = item;
      return rest;
    });
    const data = {
      dashboardLayoutS,
      dashboardId,
      dashboardName,
      updateLayoutFlag: 1,

    };
    workBenchUseStore.saveConfig(data);
    handleCancel();
  }

  function handleCancel() {
    const { dashboardId } = queryString.parse(search);
    // eslint-disable-next-line prefer-const
    let { dashboardName, ...searchParams } = queryString.parse(search);
    searchParams = { ...searchParams, dashboardId };
    history.push({
      pathname: '/workbench',
      search: `?${queryString.stringify(searchParams)}`,
    });
  }

  const renderBtns = () => (
    <div
      className={styles[`${setPrefixCls}-header-right-btnGroups`]}
    >
      <Button
        key="1"
        onClick={openAddComponents}
        icon="settings-o"
      >
        卡片配置
      </Button>
      <Button
        key="2"
        onClick={handleCancel}
      >
        取消
      </Button>
      <Button
        key="3"
        color="primary"
        onClick={handleSave}
      >
        保存
      </Button>
    </div>
  );

  return (
    <header className={styles[`${setPrefixCls}-header`]}>
      <div className={styles[`${setPrefixCls}-header-left`]}>
        <span className={styles[`${setPrefixCls}-header-left-title`]}>配置自定义视图</span>
        <TextField
          dataSet={editHeaderDs}
          name="dashboardName"
          prefix="自定义视图名称:"
          className={styles[`${setPrefixCls}-header-left-title-name`]}
        />
        <Select
          name="internalTemplate"
          dataSet={editHeaderDs}
          className={styles[`${setPrefixCls}-header-left-title-internal`]}
          // onChange={handleChange}
        />
      </div>
      <div className={styles[`${setPrefixCls}-header-right`]}>
        {renderBtns()}
      </div>
    </header>
  );
};

export default WorkBenchSettingHeader;
