import JsonBig from 'json-bigint';
import { cloneDeep } from 'lodash';

/* eslint-disable import/no-anonymous-default-export */
export default (() => ({
  autoQuery: true,
  pageSize: 40,
  transport: {
    read: ({ data }) => ({
      url: 'iam/v1/dashboard-cards',
      method: 'get',
      transformResponse: (value) => {
        try {
          if (value) {
            const { content, ...rest } = JsonBig.parse(value);
            const tempContent = content.map((card) => {
              const { maxH, maxW, ...other } = card;
              return {
                ...other,
                i: card.cardCode,
                type: card.cardCode,
                describe: card.description,
                title: card.cardName,
                img: card.icon,
                layout: {
                  w: card.w,
                  h: card.h,
                  minH: card.minH,
                  minW: card.minW,
                  i: card.cardCode,
                },
              };
            });
            const abc = cloneDeep(tempContent[18]);
            tempContent.unshift({
              ...abc,
              cardCode: 'ajmtest',
              i: 'ajmtest',
              cardName: '项目版本进度',
              cardId: 99,
              description: 'xxxx',
              describe: '展示项目版本的进度信息',
              title: '项目版本进度统计',
              type: 'ajmtest',
            });
            console.log({ ...rest, content: tempContent });
            return { ...rest, content: tempContent };
          }
        } catch (error) {
          return error;
        }
      },
    }),
  },
}));
