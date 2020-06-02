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

function historyReplaceMenu(history, path, uri) {
  historyPushMenu(history, path, uri, 'replace');
}

export {
  historyPushMenu,
  historyReplaceMenu,
};
