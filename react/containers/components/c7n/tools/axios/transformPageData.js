import queryString from 'query-string';

export function transformResponsePage(data) {
  if (data.content) {
    data.list = data.content;
    data.total = data.totalElements;
    data.pageSize = data.size;
    data.pageNum = data.number + 1;
  }
  // console.log(data);
  return data;
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
