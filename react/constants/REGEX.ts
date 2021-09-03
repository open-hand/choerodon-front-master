// 小写字母、数字、_
const LCLETTER_NUM = /^[a-z]([-a-z0-9]*[a-z0-9])?$/

const LCLETTER_NUMREGEX = {
  regex: /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
  text: '只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾',
}

export {
  LCLETTER_NUM,
  LCLETTER_NUMREGEX,
}
