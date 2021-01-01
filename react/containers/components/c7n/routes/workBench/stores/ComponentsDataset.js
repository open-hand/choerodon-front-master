import { map } from 'lodash';

/* eslint-disable import/no-anonymous-default-export */
export default ({
  workBenchUseStore,
}) => ({
  paging: false,
  autoQuery: true,
  transport: {

  },
  events: {
    load: ({ dataSet }) => {
      const tempData = map(dataSet.toData(), (item) => {
        if (item.type === 'starTarget') {
          return item;
        }
        const tempItem = item;
        tempItem.layout.static = false;
        return tempItem;
      });
      workBenchUseStore.setComponents(tempData);
    },
  },
});
