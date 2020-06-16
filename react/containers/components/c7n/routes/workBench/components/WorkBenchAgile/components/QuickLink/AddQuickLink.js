import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {Form, Select, SelectBox, TextField} from "choerodon-ui/pro";

const { Option } = Select;

export default observer(({ dataSet, modal, useStore, data }) => {
  const optionRenderer = ({ text }) => renderer({ text });

  const renderer = ({ text }) => {
    return (text === '加载更多' ? (
      <a>{text}</a>
    ) : text)
  };

  const handleSumbit = async () => {
    try {
      const result = await dataSet.validate();
      if (result) {
        let res;
        if (data) {
          res = await useStore.axiosEditQuickLink(dataSet.toData()[0]);
        } else {
          res = await useStore.axiosCreateQuickLink(dataSet.toData()[0]);
        }
        if (res.failed) {
          return false;
        }
      }
      return false;
    } catch (e) {
      return true;
    }
  }

  modal.handleOk(handleSumbit)

  useEffect(() => {
    if (data) {
      dataSet.loadData([data]);
    }
  }, [])

  const [isProject, setIsProject] = useState(true);

  return (
    <Form dataSet={dataSet}>
      <SelectBox onChange={(data) => setIsProject(data === 'project')} name="scope">
        <Option value="project">项目可见</Option>
        <Option value="self">仅自己可见</Option>
      </SelectBox>
      {
        (isProject) ? (
          <Select
            name="projectId"
            searchable
            searchMatcher="name"
            optionRenderer={optionRenderer}
            renderer={renderer}
          />
        ) : ''
      }
      <TextField name="name" />
      <TextField name="linkUrl" />
    </Form>
  )
});
