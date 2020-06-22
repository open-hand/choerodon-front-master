import { message } from 'choerodon-ui/pro';
import url from 'url';

function historyPushMenu(history, path, domain, method = 'push') {
  if (!domain || LOCAL) {
    history[method](path);
  } else if (!path) {
    window.location = `${domain}`;
  } else {
    const reg = new RegExp(domain, 'g');
    if (reg.test(window.location.host)) {
      history[method](path);
    } else {
      window.location = `${domain}/#${path}`;
    }
  }
}

function getRandomBackground() {
  const valiable = [
    'linear-gradient(225deg,rgba(152,229,218,1) 0%,rgba(0,191,165,1) 100%)',
    'linear-gradient(226deg,rgba(255,212,163,1) 0%,rgba(255,185,106,1) 100%)',
    'linear-gradient(226deg,rgba(161,188,245,1) 0%,rgba(104,135,232,1) 100%)',
    'linear-gradient(226deg,rgba(255,177,185,1) 0%,rgba(244,133,144,1) 100%)',
  ]
  return valiable[Math.floor((Math.random()*valiable.length))]
}

function historyReplaceMenu(history, path, uri) {
  historyPushMenu(history, path, uri, 'replace');
}

export {
  historyPushMenu,
  historyReplaceMenu,
  getRandomBackground,
};
