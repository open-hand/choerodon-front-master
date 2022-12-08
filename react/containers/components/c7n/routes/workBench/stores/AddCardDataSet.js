import JsonBig from 'json-bigint';

/* eslint-disable import/no-anonymous-default-export */
export default (() => ({
  autoQuery: true,
  pageSize: 40,
  transport: {
    read: ({ data }) => ({
      url: 'cbase/v1/dashboard-cards',
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
            return { ...rest, content: tempContent };
          }
        } catch (error) {
          return error;
        }
      },
    }),
  },
}));
