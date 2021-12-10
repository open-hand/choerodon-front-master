import moment from 'moment';

function autoRefresh() {
  register();
}

function register() {
  window.addEventListener('error', (e) => {
    if ((findJs(e) || findCss(e)) && timeLimit()) {
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('监测到网站已更新，已自动刷新');
      }
      localStorage.setItem('refresh.latest.time', moment().format('YYYY-MM-DD HH:mm:ss'));
      window.location.reload();
    }
  }, true);
}

function findJs(e) {
  return String(e.target.nodeName).toLocaleLowerCase() === 'script' && /.*?chunk.js/.test(e.target.src);
}
function findCss(e) {
  return String(e.target.nodeName).toLocaleLowerCase() === 'link' && e.target.type === 'text/css' && /.*?.css/.test(e.target.href);
}
function timeLimit() {
  const latestTime = localStorage.getItem('refresh.latest.time');
  const isNeedRefresh = !latestTime || !moment(latestTime, 'YYYY-MM-DD HH:mm:ss').isValid()
    || moment(latestTime, 'YYYY-MM-DD HH:mm:ss').add('1', 'minute').diff(moment()) < 0;
  return isNeedRefresh;
}
export default autoRefresh;
