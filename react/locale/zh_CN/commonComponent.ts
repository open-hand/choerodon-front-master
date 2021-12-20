const inviteBtn = {
  'boot.commonComponent.inviteBtn.inviteteammate': '邀请成员',
  'boot.commonComponent.inviteBtn.invitEmail': '邮件邀请成员',
  'boot.commonComponent.inviteBtn.invitLink': '链接邀请成员',
  'boot.commonComponent.inviteBtn.inviteteammateOrg': '邀请用户',
  'boot.commonComponent.inviteBtn.invitEmailOrg': '邮件邀请用户',
  'boot.commonComponent.inviteBtn.invitLinkOrg': '链接邀请用户',
} as const;

// 邀请试用
const trialInvite = {
  'boot.commonComponent.trialInvite.invitation': '邀请试用',
  'boot.commonComponent.trialInvite.link.desc': '将您的专属推广链接分享给好友，邀请好友分享页面进行试用注册，成为推荐达人可领取实物礼品',
  'boot.commonComponent.trialInvite.link.link': '邀请链接',
  'boot.commonComponent.trialInvite.invitation.desc': '填写好友信息，分享专属邀请给好友，邀请好友在分享页面进行试用注册，成为推荐达人可领实物礼品',
  'boot.commonComponent.trialInvite.btnInvitation': '邀请',
  'boot.commonComponent.trialInvite.haveInvitationed': '已邀请',
  'boot.commonComponent.trialInvite.companyName': '公司名称',
  'boot.commonComponent.trialInvite.websiteAddress': '官网地址',
  'boot.commonComponent.trialInvite.industry': '行业',
  'boot.commonComponent.trialInvite.wants': '想要使用的功能',
};

const all = {
  ...inviteBtn,
  ...trialInvite,
};

export default all;
