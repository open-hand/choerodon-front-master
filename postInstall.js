// const globby = require('globby');
// const { readFileSync, writeFileSync } = require('fs-extra');
// const { c7nComponents, c7nProComponents } = require('../lib/utils/uedConfig');

// const cwd = process.cwd();

// const globbyOptions = {
//   cwd,
//   ignore: [
//     'node_modules/choerodon-ui/**/style/*.js',
//     'node_modules/choerodon-ui/**/locale/*.js',
//     'node_modules/choerodon-ui/**/locale-provider/*.js',
//     'node_modules/choerodon-ui/pro/lib/index.js',
//     'node_modules/choerodon-ui/pro/lib/index.js',
//   ],
// };

// // 顺序很重要，不能更换
// const customComponents = [
//   ...c7nComponents.map(c => ({ comp: c, type: 'common' })),
//   ...c7nProComponents.map(c => ({ comp: c, type: 'pro' })),
// ];

// async function run() {
//   const commonFiles = await globby([
//     'node_modules/choerodon-ui/lib/**/*.js',
//   ], globbyOptions);
//   const proFiles = await globby([
//     'node_modules/choerodon-ui/pro/lib/**/*.js',
//   ], globbyOptions);

//   const libFiles = commonFiles.map(f => ({ file: f, type: 'common' })).concat(proFiles.map(file => ({ file, type: 'pro' }))).map(o => ({ ...o, from: 'lib' }));

//   const esFiles = [
//     ...(await globby([
//       'node_modules/choerodon-ui/es/**/*.js',
//     ], globbyOptions)).map(file => ({ file, type: 'common' })),
//     ...(await globby([
//       'node_modules/choerodon-ui/pro/es/**/*.js',
//     ], globbyOptions)).map(file => ({ file, type: 'pro' })),
//   ].map(o => ({ ...o, from: 'es' }));

//   [...libFiles, ...esFiles].forEach(({ file, type: fileType, from }) => {
//     const content = readFileSync(file, 'utf-8');
//     let current = content;
//     for (let i = 0; i < customComponents.length; i++) {
//       const {comp: c, type} = customComponents[i];
//       const upper = c.replace(c.charAt(0), c.charAt(0).toUpperCase());
//       const reg = from === 'lib' ? new RegExp(`.*_${c}\\s+.*\\((require\\(.*\\))\\)`, 'g') : new RegExp(`import\\s+${toCamelCase(c)}\\s+from\\s+'.*'`);
//       const upperReg = new RegExp(`.*_${upper}\\s+.*\\((require\\(.*\\))\\)`, 'g');
//       const target = `require('@hzero-front-ui/c7n-ui/lib/${toCamelCase(c)}${type === 'pro' ? 'Pro' : ''}')`;
//       if (file.includes(c)) return;

//       if(fileType === 'common' && type === 'pro') continue;

//       if (from === 'lib') {
//         if (reg.test(content) || upperReg.test(current)) {
//           current = current.replace(RegExp.$1, target);
//         }
//       } else {
//         current = current.replace(reg, `import ${toCamelCase(c)} from '@hzero-front-ui/c7n-ui/lib/${toCamelCase(c)}${type === 'pro' ? 'Pro' : ''}';`);
//       }
//       writeFileSync(file, current, 'utf8');
//     }
//   });
// }

// function toCamelCase(name) {
//   const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
//   const MOZ_HACK_REGEXP = /^moz([A-Z])/;
//   const ret = name
//     .replace(SPECIAL_CHARS_REGEXP, function transform(_, separator, letter, offset) {
//       return offset ? letter.toUpperCase() : letter;
//     })
//     .replace(MOZ_HACK_REGEXP, "Moz$1");
//   return ret.slice(0, 1).toUpperCase() + ret.slice(1);
// }

// run();

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
