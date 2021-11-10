/* eslint-disable import/no-anonymous-default-export */
import Jsonbig from 'json-bigint';
import { get } from 'lodash';
import axios from '@/components/axios';

export default ({
  quickLinkUseStore, organizationId, selectedProjectId, linkType,
}) => ({
  autoQuery: true,
  paging: true,
  pageSize: 10,
  axios,
  transport: {
    read: ({ dataSet, data }) => ({
      url: `/iam/choerodon/v1/organizations/${organizationId}/quick_links/scope/${linkType}${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
      transformResponse(res) {
        try {
          const mainData = Jsonbig.parse(res);
          if (mainData && mainData.failed) {
            return mainData;
          }
          let newData = [...mainData.content];
          if (mainData.number > 0 && dataSet) {
            newData = [...dataSet.toData(), ...mainData.content];
          }
          if (dataSet) {
            // eslint-disable-next-line no-param-reassign
            dataSet.pageSize *= (mainData.number + 1);
          }
          quickLinkUseStore.setListHasMore(
            mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
          );
          return newData;
        } catch (error) {
          return res;
        }
      },
    }),
  },
});
