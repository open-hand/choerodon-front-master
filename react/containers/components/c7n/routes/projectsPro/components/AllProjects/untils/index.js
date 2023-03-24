import { DataSet } from 'choerodon-ui/pro';

function transformColumnDataToSubmit(columnsData) {
  const listLayoutColumnRelVOS = [];
  columnsData.forEach((item, index) => {
    const iObj = {
      columnCode: item.name,
      display: item.isSelected,
      sort: index,
      width: item.width || 0,
      label: item.label,
    };
    listLayoutColumnRelVOS.push(iObj);
  });
  const postObj = {
    applyType: 'projectView',
    listLayoutColumnRelVOS,
  };
  return postObj;
}

function transformToSearchFieldsConfig(systemConfig, customFields) {
  // 根据fieldType 来看给什么ds的配置
  const arr = [
    {
      type: 'FlatSelect',
      initial: false,
      dsProps: {
        name: 'test',
        options: new DataSet({
          data: [
            {
              meaning: '是',
              value: '是',
            },
            {
              meaning: '否',
              value: '否',
            },
          ],
        }),
      },
      eleProps: {
        multiple: false,
        placeholder: '是否为项目定制',
      },
    },
  ];
  return systemConfig.concat(arr);
}

function transformToFilterFieldsConfig(data) {
  const newData = [];
  data.forEach((item) => {
    newData.push({
      name: item.code,
      label: item.name,
    });
  });
  return newData;
}

export {
  transformColumnDataToSubmit,
  transformToSearchFieldsConfig,
  transformToFilterFieldsConfig,
};
