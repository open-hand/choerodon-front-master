import { AxiosResponse } from 'axios';

export default function transformResponsePage(resData:any) {
  const data = resData;
  if (data?.content) {
    data.list = data.content;
    data.total = data.totalElements;
    data.pageSize = data.size;
    data.pageNum = data.number + 1;
    data.hasNextPage = data.totalElements > 0 && data.totalElements / data.size > data.number + 1;
    data.isFirstPage = data.number === 0;
  }
  return data;
}
