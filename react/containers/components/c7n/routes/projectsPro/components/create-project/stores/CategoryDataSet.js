/* eslint-disable no-param-reassign */
function handleDisabled({
  dataSet,
  record,
  categoryCodes,
  isSelected,
  createProjectStore,
  setFlag,
}) {
  const isSenior = createProjectStore.getIsSenior;

  if (!isSenior) {
    return;
  }

  if (
    [
      categoryCodes.program,
      categoryCodes.agile,
      categoryCodes.waterfall,
    ].indexOf(record.get('code')) !== -1
  ) {
    setRequireModule({
      dataSet, selected: isSelected, categoryCodes,
    });
    const agileRecord = dataSet.find(
      (eachRecord) => eachRecord.get('code') === categoryCodes.agile,
    );
    const programRecord = dataSet.find(
      (eachRecord) => eachRecord.get('code') === categoryCodes.program,
    );
    const waterfallRecord = dataSet.find(
      (eachRecord) => eachRecord.get('code') === categoryCodes.waterfall,
    );
    if (record === agileRecord || record === programRecord) {
      const agileOrProgramSelectedNum = agileRecord.isSelected + programRecord.isSelected;
      if (!isSelected && agileOrProgramSelectedNum === 1) {
        return;
      }
      waterfallRecord.setState('disabled', isSelected);
    }
    //  敏捷,项目群,瀑布三种项目类型互斥
    if (record === waterfallRecord) {
      agileRecord.setState('disabled', isSelected);
      programRecord.setState('disabled', isSelected);
    }
    if (record === agileRecord) {
      waterfallRecord.setState('disabled', isSelected);
      programRecord.setState('disabled', isSelected);
    }
    if (record === programRecord) {
      agileRecord.setState('disabled', isSelected);
      waterfallRecord.setState('disabled', isSelected);
    }

    const bool = dataSet.getState('isBeforeAgile');
    const bool1 = dataSet.getState('isBeforeProgram');
    const bool2 = dataSet.getState('isBeforeWaterfall');

    const isEdit = dataSet.getState('isEdit');
    if (isEdit && bool) {
      waterfallRecord.setState('disabled', true);
      programRecord.setState('disabled', true);
    }
    if (isEdit && bool1) {
      waterfallRecord.setState('disabled', true);
      agileRecord.setState('disabled', true);
    }
    if (isEdit && bool2) {
      agileRecord.setState('disabled', true);
      programRecord.setState('disabled', true);
    }
  }
  // 创建项目时可以同时选择项目群和敏捷管理
  // 修改项目时项目群可以加上敏捷，敏捷不能加上项目群
  // 原项目是加过项目群后不能改成单独一个敏捷的类型
  if (record.get('code') === categoryCodes.agile) {
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
  }
  if (record.get('code') === categoryCodes.program) {
    if (dataSet.getState('isEdit') && dataSet.getState('isBeforeProgram')) {
      const findRecord = dataSet.find(
        (eachRecord) => eachRecord.get('code') === categoryCodes.agile,
      );
      // findRecord && findRecord.setState('disabled', isSelected);
      // if (!isSelected && findRecord?.isSelected) {
      //   findRecord.isSelected = false;
      // }

      // 修改这里的逻辑为只要选择过敏捷项目群不可以改变为单独的一个敏捷类型 所以在这里直接禁用敏捷项目
      findRecord && findRecord.setState('disabled', true);
    }
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
  }
}

function setRequireModule({
  dataSet, selected, categoryCodes,
}) {
  const findRecord = dataSet.find(
    (eachRecord) => eachRecord.get('code') === categoryCodes.require,
  );
  if (!findRecord) {
    return;
  }
  if (selected) {
    findRecord.setState('disabled', false);
    if (findRecord.getState('isRequire') && !findRecord.getState('isEdit')) {
      dataSet.select(findRecord);
    }
  } else {
    const codeArr = [categoryCodes.agile, categoryCodes.program, categoryCodes.waterfall];
    const hasSelected = dataSet.some(
      (eachRecord) => codeArr.includes(eachRecord.get('code')) && eachRecord.isSelected,
    );

    if (!hasSelected) {
      dataSet.unSelect(findRecord);
    }
    findRecord.setState('disabled', !hasSelected);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({
  organizationId,
  categoryCodes,
  createProjectStore,
  inNewUserGuideStepOne,
}) => ({
  autoCreate: false,
  autoQuery: false,
  selection: 'multiple',
  paging: false,
  transport: {
    read: {
      url: organizationId
        ? `cbase/v1/organizations/${organizationId}/project_categories`
        : '',
      method: 'get',
    },
  },
  events: {
    select: ({ dataSet, record }) => {
      record.isSelected = true;
      handleDisabled({
        dataSet,
        record,
        categoryCodes,
        isSelected: true,
        createProjectStore,
      });
    },
    unSelect: ({ dataSet, record }) => {
      if (inNewUserGuideStepOne && record.get('code') === 'N_AGILE') {
        record.isSelected = true;
      } else {
        record.isSelected = false;
        handleDisabled({
          dataSet,
          record,
          categoryCodes,
          isSelected: false,
          createProjectStore,
        });
      }
    },
  },
});
