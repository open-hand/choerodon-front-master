// 这里会报ts的错误，是需要装@types/webpack的
// 后续重构完再boot中加入
// 通过webpack context去导入多模块，就是为了不在页面中一个个写，对，是这样的

// @ts-expect-error
const req = require.context('../assets/icons', false, /\.sprite.svg$/);

req.keys().forEach(req);
