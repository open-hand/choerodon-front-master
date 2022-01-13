/* eslint-disable no-param-reassign */
function handleDisabled({
  dataSet, record, categoryCodes, isSelected, createProjectStore,
}) {
  const isSenior = createProjectStore.getIsSenior;
  if (!isSenior) {
    return;
  }
  // 创建项目时可以同时选择项目群和敏捷管理
  // 修改项目时项目群可以加上敏捷，敏捷不能加上项目群
  // 原项目是加过项目群后不能改成单独一个敏捷的类型
  if (record.get('code') === categoryCodes.agile) {
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
  }
  if (record.get('code') === categoryCodes.program) {
    if (dataSet.getState('isEdit') && dataSet.getState('isCurrentProgram')) {
      const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.agile);
      findRecord && findRecord.setState('disabled', !isSelected);
      if (!isSelected && findRecord?.isSelected) {
        findRecord.isSelected = false;
      }
    }
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
  }
}

function setRequireModule({ dataSet, selected, categoryCodes }) {
  const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.require);
  if (!findRecord) {
    return;
  }
  if (selected) {
    findRecord.setState('disabled', false);
    if (findRecord.getState('isRequire') && !findRecord.getState('isEdit')) {
      dataSet.select(findRecord);
    }
  } else {
    const codeArr = [categoryCodes.agile, categoryCodes.program];
    const hasSelected = dataSet.some((eachRecord) => (codeArr.includes(eachRecord.get('code')) && eachRecord.isSelected));
    if (!hasSelected) {
      dataSet.unSelect(findRecord);
    }
    findRecord.setState('disabled', !hasSelected);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({
  organizationId, categoryCodes, createProjectStore, inNewUserGuideStepOne,
}) => ({
  autoCreate: false,
  autoQuery: false,
  selection: 'multiple',
  paging: false,
  transport: {
    read: {
      url: organizationId ? `iam/v1/organizations/${organizationId}/project_categories` : '',
      method: 'get',
    },
  },
  events: {
    select: ({ dataSet, record }) => {
      record.isSelected = true;
      handleDisabled({
        dataSet, record, categoryCodes, isSelected: true, createProjectStore,
      });
    },
    unSelect: ({ dataSet, record }) => {
      if (inNewUserGuideStepOne && record.get('code') === 'N_AGILE') {
        record.isSelected = true;
      } else {
        record.isSelected = false;
        handleDisabled({
          dataSet, record, categoryCodes, isSelected: false, createProjectStore,
        });
      }
    },
  },
});
