/* eslint-disable import/no-anonymous-default-export */
import Jsonbig from 'json-bigint';
import { get } from 'lodash';
import moment from 'moment';
import axios from '@/components/axios';
import { getRandomBackground } from '@/utils';

export default ({
  quickLinkUseStore, organizationId, selectedProjectId, linkType,
}) => ({
  autoQuery: true,
  paging: false,
  pageSize: 10,
  axios,
  transport: {
    read: ({ dataSet, data }) => ({
      url: `/cbase/choerodon/v1/organizations/${organizationId}/quick_links/scope/${linkType}${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
      transformResponse(res) {
        try {
          const mainData = Jsonbig.parse(res);
          const newRes = [];
          const projectNames = [];
          if (mainData.number + 1 < mainData.totalPages) {
            quickLinkUseStore.setListHasMore(true);
          } else {
            quickLinkUseStore.setListHasMore(false);
          }
          mainData?.content.forEach((item) => {
            const indexProjectName = projectNames.indexOf(item?.projectName);
            const unix = String(moment(item.projectCreationDate).unix());

            if (indexProjectName === -1) {
              projectNames.push(item?.projectName);
              newRes.push({
                projectName: item?.projectName,
                projectImage: item?.projectImage,
                background: getRandomBackground(unix.substring(unix.length - 3)),
                children: [{
                  ...item,
                }],
              });
            } else {
              newRes[indexProjectName].children.push({
                ...item,
              });
            }
          });
          // if (mainData && mainData.failed) {
          //   return mainData;
          // }
          // let newData = [...mainData.content];
          // if (mainData.number > 0 && dataSet) {
          //   newData = [...dataSet.toData(), ...mainData.content];
          // }
          // if (dataSet) {
          //   // eslint-disable-next-line no-param-reassign
          //   dataSet.pageSize *= (mainData.number + 1);
          // }
          // quickLinkUseStore.setListHasMore(
          //   mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
          // );
          return newRes;
        } catch (error) {
          return res;
        }
      },
    }),
  },
});
