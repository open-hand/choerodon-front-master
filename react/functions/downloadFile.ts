export function downloadFile(url: string, name?: string, callbackFunc?: Function) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  // 设置返回数据的类型为blob
  xhr.responseType = 'blob';
  // 资源完成下载
  // 增加的代码
  xhr.onprogress = function (e) {
    if (e.lengthComputable) {
      const { total, loaded } = e;
      const percentage = ((loaded / total) * 100).toFixed(0);
      callbackFunc && callbackFunc(+percentage, false);
      // @ts-ignore
    } else if (e?.target?.response) {
      callbackFunc && callbackFunc(100, false);
    }
  };
  xhr.onloadend = function () {
    callbackFunc && callbackFunc(100, true);
  };
  xhr.onload = function () {
    // 获取响应的blob对象
    const blob = xhr.response;
    const a = document.createElement('a');
    // 设置下载的文件名字
    const newNamename = name || blob.name || 'download';
    a.download = newNamename;
    // 解决安全问题，新页面的window.opener 指向前一个页面的window对象
    // 使用noopener使 window.opener 获取的值为null
    a.rel = 'noopener';
    // 创建一个DOMString指向这个blob
    // 简单理解就是为这个blob对象生成一个可访问的链接
    a.href = URL.createObjectURL(blob);
    // 40s后移除这个临时链接
    setTimeout(() => { URL.revokeObjectURL(a.href); }, 4E4); // 40s
    // 触发a标签，执行下载
    setTimeout(() => {
      a.dispatchEvent(new MouseEvent('click'));
    }, 0);
  };
  // 发送请求
  xhr.send();
}
