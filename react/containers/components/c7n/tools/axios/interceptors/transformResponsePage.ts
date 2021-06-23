import { AxiosResponse } from 'axios';

export default function transformResponsePage(response:AxiosResponse) {
  const { data } = response;
  const temp = data;
  if (temp?.content) {
    temp.list = data.content;
    temp.total = data.totalElements;
    temp.pageSize = data.size;
    temp.pageNum = data.number + 1;
    temp.hasNextPage = data.totalElements > 0 && data.totalElements / data.size > data.number + 1;
    temp.isFirstPage = data.number === 0;
  }
  response.data = temp;
  return response;
}
