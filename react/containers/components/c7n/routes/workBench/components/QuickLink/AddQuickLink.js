/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form, Select, SelectBox, TextField, Tooltip,
  DataSet,
} from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import addLinkDataSet from './stores/addLinkDataSet';

import projectIdOptionsDataSet from './stores/projectIdOptionsDataSet';

const { Option } = Select;

export default observer(({
  AppState, modal, useStore, data, workBenchUseStore, type, handleRefresh, addLinkDs,
}) => {
  const projectIdOptionsDs = useMemo(() => new DataSet(projectIdOptionsDataSet(AppState.getUserId)), [AppState]);
  const dataSet = useMemo(() => new DataSet(addLinkDataSet(projectIdOptionsDs)), []);

  const handleSumbit = async () => {
    try {
      const result = await dataSet.validate();
      if (result) {
        const res = await dataSet.submit();
        if (res && res.failed) {
          return false;
        }
        handleRefresh && handleRefresh();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  modal.handleOk(handleSumbit);

  const [isProject, setIsProject] = useState(true);

  useEffect(() => {
    if (type) {
      dataSet.current?.set('scope', type);
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

  useEffect(() => {
    setIsProject(dataSet.current.get('scope') === 'project');
  }, [dataSet.current.get('scope')]);

  return (
    <Form labelLayout="float" className="addQuickLinkForm" record={dataSet.current}>
      <p className="addQuickLinkForm-p">
        链接公开范围
        <Tooltip title="项目可见的链接创建成功后，所选项目下的所有人员均能查看并使用该链接；对于仅自己可见的链接，则只有本人能够查看与使用。">
          <Icon type="help" />
        </Tooltip>
      </p>
      <SelectBox
        className="addQuickLinkForm-scope"
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
