const globby = require('globby');
const path = require('path');
const { readFileSync, writeFileSync } = require('fs');

const cwd = winPath(process.cwd()).replace(/\/node_modules\/.*/, '');

const globbyOptions = {
  cwd,
  ignore: [
    'node_modules/choerodon-ui/**/style/*.js',
    'node_modules/choerodon-ui/**/locale/*.js',
    'node_modules/choerodon-ui/**/locale-provider/*.js',
    'node_modules/choerodon-ui/pro/lib/index.js',
    'node_modules/choerodon-ui/pro/lib/index.js',
  ],
};

async function processProComponent(compName, target) {
  const libFiles = await globby([
    `node_modules/choerodon-ui/pro/lib/${target}/**/*.js`,
  ], globbyOptions);
  const esFiles = await globby([
    `node_modules/choerodon-ui/pro/es/${target}/**/*.js`,
  ], globbyOptions);

  libFiles.forEach((file) => {
    const filePath = path.resolve(cwd, file);
    const content = readFileSync(filePath, 'utf-8');
    const reg = new RegExp(`.*\\s+_${compName}\\s+.*\\((require\\(.*\\))\\)`, 'g');
    let result = content;
    if (reg.test(content)) {
      result = result.replace(RegExp.$1, `require('@hzero-front-ui/c7n-ui/lib/${toCamelCase(compName)}Pro')`);
    }
    writeFileSync(filePath, result, 'utf8');
  });

  esFiles.forEach((file) => {
    const filePath = path.resolve(cwd, file);
    const content = readFileSync(filePath, 'utf-8');
    const reg = new RegExp(`import\\s+${compName}\\s+from.*`, 'g');
    const result = content.replace(reg, `import ${compName} from '@hzero-front-ui/c7n-ui/lib/${toCamelCase(compName)}Pro'`);
    writeFileSync(filePath, result, 'utf8');
  });
}

[
  { target: 'table', compName: 'Form' },
  { target: 'table', compName: 'form' },
  { target: 'lov', compName: 'Table' },
].forEach(({ target, compName }) => processProComponent(compName, target));

function winPath(p) {
  return p.replace(/\\/g, '/');
}

function toCamelCase(name) {
  const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  const MOZ_HACK_REGEXP = /^moz([A-Z])/;
  const ret = name
    .replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => (offset ? letter.toUpperCase() : letter))
    .replace(MOZ_HACK_REGEXP, 'Moz$1');
  return ret.slice(0, 1).toUpperCase() + ret.slice(1);
}
