// eslint-disable-next-line no-undef
const ClientMonitor = C7NTryImport('hops-agent-wa');

function registerMonitor() {
  if (ClientMonitor) {
    ClientMonitor.register({
      serviceId: 'f07800b0a205405e97d756c33d7f450f',
      service: 'Choerodon Front',
      enableSPA: true,
      autoTracePerf: true,
      isAjax: true,
      isError: true,
      useFmp: true,
      isResource: true,
      collector: 'https://hops.hand-china.com/gw-api/opapm/v1/0/skywalking/front/trace',
      reportUrl: 'https://hops.hand-china.com/gw-api/opwa/v1/up-log',
    });
  }
}

export default registerMonitor;
