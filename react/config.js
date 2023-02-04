module.exports = {
  port: 8000,
  master: './react/index.js',
  projectType: 'choerodon',
  htmlTemplate: './react/index.template.html',
  modules: [
    '.',
  ],
  sharedModules: {
    ckeditor: {
      singleton: true,
      eager: true,
    },
    '@choerodon/ckeditor': {
      singleton: true,
      eager: true,
    },
    '@hzero-front-ui/c7n-ui': {
      singleton: true,
      requiredVersion: false,
    },
    '@hzero-front-ui/core': {
      singleton: true,
      requiredVersion: false,
    },
    '@hzero-front-ui/font': {
      singleton: true,
      requiredVersion: false,
    },
    '@hzero-front-ui/themes': {
      singleton: true,
      requiredVersion: false,
    },
    'react-query': {
      singleton: true,
      requiredVersion: false,
    },
    '@choerodon/inject': {
      singleton: true,
      requiredVersion: false,
    },
  },
};
