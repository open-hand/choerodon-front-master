// 小写字母、数字、_
const LCLETTER_NUM = /^[a-z]([-a-z0-9]*[a-z0-9])?$/

const LCLETTER_NUMREGEX = {
  regex: /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
  text: '只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾',
}

const WEBSITE_REGEX = {
  regex: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
  text: '请输入正确的网页地址',
}

export {
  LCLETTER_NUM,
  LCLETTER_NUMREGEX,
  WEBSITE_REGEX,
}
