export const OPTIONS_EN_US = {
  'boot.execute': 'Execute',
  'boot.return': 'Back',
  'boot.confirm': 'Confirm',
  'boot.refresh': 'Refresh',
  'boot.associate': 'Associate',
  'boot.upgrade': 'Upgrade',
  'boot.change': 'Change',
  'boot.commit': 'Commit',
  'boot.install': 'Install',
  'boot.uninstall': 'Uninstall',
  'boot.cancel': 'Cancel',
  'boot.save': 'Save',
  'boot.reset': 'Reset',
  'boot.stop': 'Disable',
  'boot.new': 'Create',
  'boot.create': 'Create',
  'boot.edit': 'Edit',
  'boot.modify': 'Edit',
  'boot.delete': 'Delete',
  'boot.enable': 'Enable',
  'boot.disable': 'Disable',
  'boot.export': 'Export',
  'boot.import': 'Import',
  'boot.rename': 'Rename',
  'boot.copy': 'Copy',
  'boot.check': 'Check',
  'boot.neglect': 'Neglect',
  'boot.signIn': 'Sign in',
  'boot.logout': 'Log out',
  'boot.search': 'Search',
  'boot.loadMore': 'Load More',
  'boot.update': 'Update',
  'boot.expandAll': 'Expand',
  'boot.collapseAll': 'Collapse',
  'boot.expand': 'Expand',
  'boot.collapse': 'Collapse',
  'boot.shrink': 'Shrink',
  'boot.previous': 'Previous',
  'boot.next': 'Next',
  'boot.finish': 'Finish',
} as const;

export const STATUS_EN_US = {
  // 状态描述
  'boot.null': 'NULL',
  'boot.running': 'Running',
  'boot.preparing': 'Preparing',
  'boot.operating': 'Operating',
  'boot.connect': 'Connected',
  'boot.disconnect': 'Disconnected',
  'boot.connecting': 'Connecting',
  'boot.stopping': 'Stopping',
  'boot.occupied': 'Occupied',
  'boot.deleting': 'Deleting',
  'boot.pending': 'Pending',
  'boot.stopped': 'Stopped',
  'boot.failed': 'Failed',
  'boot.deleted': 'Deleted',
  'boot.canceled': 'Canceled',
  'boot.creating': 'Creating',
  'boot.pendingcheck': 'Pending review',
  'boot.executing': 'Executing',
  'boot.notExecuted': 'Not Executed',
  'boot.terminated': 'Terminated',
  'boot.normal': 'Common',
  'boot.locked': 'Locked',
  'boot.notActive': 'Invalid',
  'boot.expired': 'Expired',
  'boot.finished': 'Finished',
  'boot.unusual': 'Unusual',
  'boot.checked': 'Checked',

} as const;

// 操作状态失败
const OPTIONS_STATUS_FAILED_EN_US = {
  'boot.execute.failed': 'failed to excute {name}',
  'boot.refresh.failed': 'failed to refresh',
  'boot.upgrade.failed': 'failed to upgrade {name}',
  'boot.change.failed': 'failed to change {name}',
  'boot.commit.failed': 'failed to commit {name}',
  'boot.install.failed': 'failed to install {name}',
  'boot.uninstall.failed': 'failed to uninstall {name}',
  'boot.cancel.failed': 'failed to cancel {name}',
  'boot.save.failed': 'failed to save {name}',
  'boot.reset.failed': 'failed to reset {name}',
  'boot.stop.failed': 'failed to stop {name}',
  'boot.new.failed': 'failed to new {name}',
  'boot.create.failed': 'failed to create {name}',
  'boot.edit.failed': 'failed to edit {name}',
  'boot.modify.failed': 'failed to modify {name}',
  'boot.delete.failed': 'failed to delete {name}',
  'boot.enable.failed': 'failed to enable {name}',
  'boot.disable.failed': 'failed to disable {name}',
  'boot.export.failed': 'failed to export {name}',
  'boot.import.failed': 'failed to import {name}',
  'boot.rename.failed': 'failed to rename {name}',
  'boot.copy.failed': 'failed to cpoy {name}',
  'boot.check.failed': 'failed to check {name}',
  'boot.signIn.failed': 'failed to auth',
  'boot.search.failed': 'failed to search {name}',
  'boot.loadMore.failed': 'failed to load',
  'boot.update.failed': 'failed to update {name}',
} as const;

// 操作状态成功
const OPTIONS_STATUS_SUCCESS_EN_US = {
  'boot.execute.success': 'successfully excute {name}',
  'boot.refresh.success': 'successfully refresh',
  'boot.upgrade.success': 'successfully upgrade {name}',
  'boot.change.success': 'successfully change {name}',
  'boot.commit.success': 'successfully commit {name}',
  'boot.install.success': 'successfully install {name}',
  'boot.uninstall.success': 'successfully uninstall {name}',
  'boot.cancel.success': 'successfully cancel {name}',
  'boot.save.success': 'successfully save {name}',
  'boot.reset.success': 'successfully reset {name}',
  'boot.stop.success': 'successfully stop {name}',
  'boot.new.success': 'successfully new {name}',
  'boot.create.success': 'successfully create {name}',
  'boot.edit.success': 'successfully edit {name}',
  'boot.modify.success': 'successfully modify {name}',
  'boot.delete.success': 'successfully delete {name}',
  'boot.enable.success': 'successfully enable {name}',
  'boot.disable.success': 'successfully disable {name}',
  'boot.export.success': 'successfully export {name}',
  'boot.import.success': 'successfully import {name}',
  'boot.rename.success': 'successfully rename {name}',
  'boot.copy.success': 'successfully cpoy {name}',
  'boot.check.success': 'successfully check {name}',
  'boot.signIn.success': 'successfully auth',
  'boot.search.success': 'successfully search {name}',
  'boot.loadMore.success': 'successfully load',
  'boot.update.success': 'successfully update {name}',
} as const;

// 语言
const LANGUAGES_EN_US = {
  // languages
  'boot.zh_CN': 'Chinese',
  'boot.en_US': 'English(US)',
  'boot.language': 'Languages',
} as const;

// 用户相关
const USER_EN_US = {
  'boot.username': 'Username',
  'boot.personal': 'Personal',
  'boot.personalInfo': 'Personal Info',
  'boot.password': 'Password',
  'boot.accountLogin': 'Account Login',
  'boot.mobileLogin': 'Mobile Login',
  'boot.account': 'Login Account',
  'boot.email': 'Email',
  'boot.forgetPassword': 'Forgot Password',
} as const;

// 单位相关
const UNIT_ZH_CN = {
  'boot.unit.people': 'people',
  'boot.unit.times': '{number} time',
} as const;
// 人物
const CHARACTER_ZH_CN = {
  'boot.organizationAdmin': 'Organization Administrator',
  'boot.user': 'User',
  'boot.projectOwner': 'Project Owner',
  'boot.projectMember': 'Project Member',
  'boot.organizationOwner': 'Organization owner',
} as const;
const COMMON_EN_US = {
  ...USER_EN_US,
  ...LANGUAGES_EN_US,
  ...OPTIONS_EN_US,
  ...STATUS_EN_US,
  ...OPTIONS_STATUS_FAILED_EN_US,
  ...OPTIONS_STATUS_SUCCESS_EN_US,
  ...CHARACTER_ZH_CN,
  ...UNIT_ZH_CN,
  'boot.mobilephone': 'Tel',
  'boot.field': 'Field',

  'boot.transaction': 'Transaction',
  'boot.task': 'Task',
  'boot.principal': 'Owner',
  'boot.stage': 'Stage',
  'boot.client': 'Client',

  'boot.yes': 'Yes',
  'boot.no': 'No',
  'boot.application': 'APP',
  'boot.permissions': 'Permission Assignment',
  'boot.iknow': 'I know',
  'boot.version': 'Version',
  'boot.file': 'File',
  'boot.available': 'Available',
  'boot.unavailable': 'Unavailable',
  'boot.log': 'Log',
  'boot.ingress': 'Ingress',
  'boot.address': 'Address',
  'boot.path': 'Path',
  'boot.captcha': 'Captcha',
  'boot.annotation': 'Annotation',
  'boot.routing': 'Routing',
  'boot.branch': 'Branch',
  'boot.tag': 'Tag',
  'boot.name': 'Name',
  'boot.code': 'Code',
  'boot.description': 'Description',
  'boot.number': 'Number',
  'boot.color': 'Color',
  'boot.startTime': 'Start Time',
  'boot.createTime': 'Creation Time',
  'boot.operation': 'Operation',
  'boot.states': 'Status',
  'boot.source': 'Source',
  'boot.role': 'Role',
  'boot.creator': 'Creator',
  'boot.creationTime': 'Creation Time',
  'boot.updater': 'Updater',
  'boot.updateTime': 'Update Time',
  'boot.appService': 'Application Services',
  'boot.components': 'Components',
  'boot.filter': 'Filter',
  'boot.filters': 'Filters',
  'boot.issues': 'Issues',
  'boot.gantt': 'Gantt',
  'boot.legend': 'Legend',
  'boot.issue': 'Issue',
  'boot.environment': 'Environment',
  'boot.automation': 'Automation',
  'boot.assignees': 'Assignees',
  'boot.personalFilter': 'Personal Filter',
  'boot.quickFilters': 'Quick Filters',
  'boot.knowledgeBase': 'Knowledge Base',
  'boot.artifactRepository': 'Artifact Repository',
  'boot.documentLibrary': 'Document Library',
  'boot.starProjects': 'Star Projects',
  'boot.project': 'Project',
  'boot.demand': 'Demand',

  'boot.note': 'Note',
  'boot.recentUse': 'Recently Used',
  'boot.pleaseSearch': 'Please Search',
  'boot.peopleNum': 'The number of people',
  'boot.time': 'Time',
  'boot.date': 'Date',
  'boot.allPeople': 'the total number of people',
  'boot.statistical': ' statistical',
  'boot.times': 'time',
  'boot.allTimes': 'total degree',
  'boot.updateDate': 'update date',
  'boot.createDate': 'create date',
  'boot.assignRootPermission': 'assign root permission',
  'boot.assignPermissions': 'assign permissions',
  'boot.assignRoles': 'assign poles',
  'boot.createOrganization': 'create organization',
  'boot.enableOrganization': 'enable organization',
  'boot.stopOrganization': 'stop organization',
  'boot.unlockUser': 'unlock user',
  'boot.enableUser': 'enable user',
  'boot.disableUser': 'disable user',
  'boot.deleteOrganizationAdminRole': 'delete the organization administrator role',
  'boot.addOrganizationAdminRole': 'add an organization administrator role',
  'boot.createProject': 'create project',
  'boot.enableProject': 'enable project',
  'boot.disableProject': 'disable project',
  'boot.createUser': 'create user',
  'boot.approvalRegister': 'approval register',
  'boot.traffic': 'traffic',
  'boot.detail': 'details',
  'boot.complete': 'complete',
  'boot.all': 'all',
  'boot.allow': 'allow',
  'boot.ban': 'ban',
} as const;

export { COMMON_EN_US };