function jsonStringifySafty(data) {
  let cache = [];
  const str = JSON.stringify(data, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // 移除
        return;
      }
      // 收集所有的值
      cache.push(value);
    }
    // eslint-disable-next-line consistent-return
    return value;
  });
  cache = null; // 清空变量，便于垃圾回收机制回收
  return str;
}

export default jsonStringifySafty;
