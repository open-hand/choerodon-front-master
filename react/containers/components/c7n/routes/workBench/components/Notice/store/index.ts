import { useState, useEffect } from 'react';
import { axios } from '@/index';
import { NoticeDTO, NoticeVO } from '../model';

export default function useStore() {
  const [data, setData] = useState<NoticeVO[]>([]);

  const fetchData = async () => {
    let res: any;
    try {
      res = (await axios.get('/hmsg/choerodon/v1/system_notice/completed', {
        params: {
          page: 1,
          size: 9999,
        },
      }));
    } catch (err) {
      window.console.log('request failed:', err);
    }

    if (!res) return;

    const result = (res.content as NoticeDTO[]).map((row) => ({
      ...row,
      sendDate: row.sendDate?.slice(0, 10) ?? '', // 截取日期
      sendDateFull: row.sendDate,
      contentOverview: row.content?.replace(/<[^>]*>|/g, '') ?? '', // 提取纯文本
    }));

    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
  };
}
