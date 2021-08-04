// 创建布局视图侧滑
import React, { useMemo, useEffect } from 'react';
import { useHistory } from 'react-router';
import queryString from 'query-string';
import {
  DataSet, Form, SelectBox, TextField, Select,
} from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useWorkBenchStore } from '../../../../stores';
// import Store from './stores';
import CreateViewDataSet from './stores/CreateViewDataSet';

const CreateViewDrawer = observer(({ modal, search, viewDs }) => {
  const history = useHistory();
  const createViewDS = useMemo(() => new DataSet(CreateViewDataSet()), []);
  const { workBenchUseStore } = useWorkBenchStore();

  useEffect(() => {
    createViewDS.create();
  }, []);

  modal.handleOk(async () => {
    const view = createViewDS.current.get('view');
    const res = await createViewDS.submit();

    if (!isEmpty(res) && res.success) {
      const { dashboardId, dashboardName } = res.list[0];
      if (view === 'INTERNAL') {
        await viewDs.query();
        viewDs.locate(viewDs.findIndex((r) => r.get('dashboardId') === dashboardId));
        workBenchUseStore.setActiveTabKey(dashboardId);
      } else {
        // 如果创建的是自定义视图 跳转到自定义视图
        let searchParams = queryString.parse(search);
        searchParams = { ...searchParams, dashboardId, dashboardName };
        history.push({
          pathname: '/workbench/edit',
          search: `?${queryString.stringify(searchParams)}`,
        });
      }
      // relationDS.query();
      return true;
    }
    if (res === undefined) {
      return true;
    }
    // 提交后后端返回报错信息
    return false;
  });

  return (
    <Form dataSet={createViewDS}>
      <SelectBox name="view" />
      {createViewDS.current?.get('view') === 'INTERNAL' && <Select name="dashboardId" noCache />}
      {createViewDS.current?.get('view') !== 'INTERNAL' && <TextField name="dashboardName" />}
    </Form>
  );
});

export default CreateViewDrawer;
