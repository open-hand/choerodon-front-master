/* eslint-disable no-param-reassign */

function handleDisabled({ dataSet, record, categoryCodes, isSelected }) {
  if (record.get('code') === categoryCodes.agile) {
    const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.program);
    findRecord && findRecord.setState('disabled', isSelected);
  }
  if (record.get('code') === categoryCodes.program) {
    const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.agile);
    findRecord && findRecord.setState('disabled', isSelected);
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
