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
  // pageSize: 0,
  axios,
  transport: {
    read: ({ dataSet, data }) => ({
      url: `/cbase/choerodon/v1/organizations/${organizationId}/quick_links/scope/${quickLinkUseStore?.type}${selectedProjectId ? `?project_id=${selectedProjectId}&page=0&size=0` : '?page=0&size=0'}`,
      method: 'get',
      transformResponse(res) {
        try {
          const mainData = Jsonbig.parse(res);
          let newRes = [];
          const projectNames = [];
          if (mainData.number + 1 < mainData.totalPages) {
            quickLinkUseStore.setListHasMore(true);
          } else {
            quickLinkUseStore.setListHasMore(false);
          }
          const originData = quickLinkUseStore.getQuickLinkList;
          mainData?.content.forEach((item) => {
            if (quickLinkUseStore.type === 'project' || originData?.length === 0 || (originData?.length > 0 && originData[0].projectName)) {
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
            } else if (originData?.length) {
              newRes = originData;
              if (!newRes[0].children.map((i) => i?.id).includes(item?.id)) {
                newRes[0].children.push(item);
              }
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
          quickLinkUseStore.setQuickLinkList(newRes);
          return newRes;
        } catch (error) {
          return res;
        }
      },
    }),
  },
});
