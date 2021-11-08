/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form, Select, SelectBox, TextField, Tooltip,
} from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';

const { Option } = Select;

export default observer(({
  AppState, modal, useStore, data, workBenchUseStore, activeId, type, handleRefresh, addLinkDs,
}) => {
  const dataSet = addLinkDs;

  const handleSumbit = async () => {
    try {
      const result = await dataSet.validate();
      if (result) {
        let res;
        if (data) {
          res = await useStore.axiosEditQuickLink(dataSet.toData()[0], activeId, type);
        } else {
          res = await useStore.axiosCreateQuickLink(dataSet.toData()[0], activeId, type);
        }
        if (res && res.failed) {
          return false;
        }
        dataSet.reset();
        handleRefresh && handleRefresh();
        return true;
      }
      return false;
    } catch (e) {
      dataSet.reset();
      return true;
    }
  };

  modal.handleOk(handleSumbit);

  modal.handleCancel(() => {
    dataSet.reset();
  });

  const [isProject, setIsProject] = useState(true);

  useEffect(() => {
    if (type) {
      dataSet.current.set('scope', type);
      setIsProject(type !== 'self');
    }
    if (data) {
      dataSet.loadData([data]);
      setIsProject(data.scope !== 'self');
      dataSet.current.set('projectId', { id: data.projectId, name: data.projectName });
    } else if (workBenchUseStore.getActiveStarProject) {
      dataSet.current.set('projectId', workBenchUseStore.getActiveStarProject.id);
    }
  }, []);

  return (
    <Form labelLayout="float" className="addQuickLinkForm" dataSet={dataSet}>
      <p className="addQuickLinkForm-p">
        链接公开范围
        <Tooltip title="项目可见的链接创建成功后，所选项目下的所有人员均能查看并使用该链接；对于仅自己可见的链接，则只有本人能够查看与使用。">
          <Icon type="help" />
        </Tooltip>
      </p>
      <SelectBox
        className="addQuickLinkForm-scope"
        onChange={(dataSource) => setIsProject(dataSource === 'project')}
        name="scope"
      >
        <Option value="project">项目可见</Option>
        <Option value="self">仅自己可见</Option>
      </SelectBox>
      {
        (isProject) ? (
          <Select
            name="projectId"
            searchable
            searchMatcher="name"
          />
        ) : ''
      }
      <TextField name="name" />
      <TextField name="linkUrl" />
    </Form>
  );
});
