// 配置自定义视图
import React, {
  useEffect, useRef, useImperativeHandle, forwardRef,
} from 'react';
import {
  TextField, Select, Button, Modal, Form,
} from 'choerodon-ui/pro';
import {
  get, map, forEach,
} from 'lodash';
import queryString from 'query-string';
import AddModal from '@/containers/components/c7n/components/addComponentsModal';
import { useWorkBenchStore } from '../../../../stores';
import { HOMEPAGE_PATH } from '@/constants';
import styles from './index.less';

const WorkBenchSettingHeader = (props, ref) => {
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

  useImperativeHandle(ref, () => ({
    openAddComponents,
  }));

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
    const mappings = addCardDs.toData();
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
        mappings={mappings}
      />,
      className: `${subPrefix}`,
    });
  }

  async function handleSave() {
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
    const res = await workBenchUseStore.saveConfig(data);
    if (res) {
      handleCancel();
    }
  }

  function handleCancel() {
    const { dashboardId } = queryString.parse(search);
    // eslint-disable-next-line prefer-const
    let { dashboardName, ...searchParams } = queryString.parse(search);
    searchParams = { ...searchParams, dashboardId };
    history.push({
      pathname: HOMEPAGE_PATH,
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
        <div className={styles[`${setPrefixCls}-header-left-form`]}>
          <Form dataSet={editHeaderDs} labelLayout="horizontal" labelWidth={1} columns={2}>
            <TextField
              clearButton
              colSpan={1}
              name="dashboardName"
              prefix="自定义视图名称:"
            />
            <Select
              name="internalTemplate"
              colSpan={1}
              prefix="官方模板布局:"
            />
          </Form>
        </div>
      </div>
      <div className={styles[`${setPrefixCls}-header-right`]}>
        {renderBtns()}
      </div>
    </header>
  );
};

export default forwardRef(WorkBenchSettingHeader);
