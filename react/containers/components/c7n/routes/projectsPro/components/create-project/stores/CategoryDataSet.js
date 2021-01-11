/* eslint-disable no-param-reassign */

function handleDisabled({
  dataSet, record, categoryCodes, isSelected,
}) {
  if (record.get('code') === categoryCodes.agile) {
    const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.program);
    findRecord && findRecord.setState('disabled', isSelected);
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
  }
  if (record.get('code') === categoryCodes.program) {
    const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.agile);
    findRecord && findRecord.setState('disabled', isSelected);
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
  }
}

function setRequireModule({ dataSet, selected, categoryCodes }) {
  const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.require);
  if (selected) {
    findRecord && findRecord.setState('disabled', false);
  } else {
    const codeArr = [categoryCodes.agile, categoryCodes.program];
    const hasSelected = dataSet.some((eachRecord) => (codeArr.includes(eachRecord.get('code')) && eachRecord.isSelected));
    if (!hasSelected) {
      dataSet.unSelect(findRecord);
    }
    findRecord.setState('disabled', !hasSelected);
  }
}

export default ({ organizationId, categoryCodes }) => ({
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
        dataSet, record, categoryCodes, isSelected: true,
      });
    },
    unSelect: ({ dataSet, record }) => {
      record.isSelected = false;
      handleDisabled({
        dataSet, record, categoryCodes, isSelected: false,
      });
    },
  },
});
