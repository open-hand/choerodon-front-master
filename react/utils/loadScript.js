function loadScrip(url, callback) {
  const script = document.createElement('script');
  if (script.readyState) { // IE
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else { // 其他浏览器
    script.onload = function () {
      callback();
    };
  }
  script.src = url;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

export default loadScrip;
