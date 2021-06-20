import queryString from 'query-string';

export function transformResponsePage(data) {
  const tempData = data;
  if (tempData?.content) {
    tempData.list = data.content;
    tempData.total = data.totalElements;
    tempData.pageSize = data.size;
    tempData.pageNum = data.number + 1;
    tempData.hasNextPage = data.totalElements > 0 && data.totalElements / data.size > data.number + 1;
    tempData.isFirstPage = data.number === 0;
  }
  return tempData;
}
export function transformRequestPage(request) {
  // 先把url上的参数去掉，放到params上
  const [url, search] = request.url.split('?');
  if (search) {
    const parsed = queryString.parse(search);
    request.url = url;
    if (!request.params) {
      request.params = {};
    }
    Object.assign(request.params, parsed || {});
  }
  // page-1
  if (request.params) {
    const { pagesize, size, page } = request.params;
    if (page !== undefined) {
      request.params.page = Math.max(request.params.page - 1, 0);
    }
    if (pagesize && !size) {
      request.params.size = pagesize;
      delete request.params.pagesize;
    }
  }
}
