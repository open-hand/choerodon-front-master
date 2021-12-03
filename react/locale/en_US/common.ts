export const OPTIONS_EN_US = {
  execute: 'Execute',
  return: 'Back',
  confirm: 'Confirm',
  refresh: 'Refresh',
  associate: 'Associate',
  upgrade: 'Upgrade',
  change: 'Change',
  commit: 'Commit',
  install: 'Install',
  uninstall: 'Uninstall',
  cancel: 'Cancel',
  save: 'Save',
  reset: 'Reset',
  stop: 'Disable',
  new: 'Create',
  create: 'Create',
  edit: 'Edit',
  modify: 'Edit',
  delete: 'Delete',
  enable: 'Enable',
  disable: 'Disable',
  export: 'Export',
  import: 'Import',
  rename: 'Rename',
  copy: 'Copy',
  check: 'Check',
  neglect: 'Neglect',
  signIn: 'Sign in',
  logout: 'Log out',
  search: 'Search',
  loadMore: 'Load More',
  update: 'Update',
  expandAll: 'Expand',
  collapseAll: 'Collapse',
  expand: 'Expand',
  collapse: 'Collapse',
  shrink: 'Shrink',
  previous: 'Previous',
  next: 'Next',
  finish: 'Finish',
} as const;

export const STATUS_EN_US = {
  // 状态描述
  null: 'NULL',
  running: 'Running',
  preparing: 'Preparing',
  operating: 'Operating',
  connect: 'Connected',
  disconnect: 'Disconnected',
  connecting: 'Connecting',
  stopping: 'Stopping',
  occupied: 'Occupied',
  deleting: 'Deleting',
  pending: 'Pending',
  stopped: 'Stopped',
  failed: 'Failed',
  deleted: 'Deleted',
  canceled: 'Canceled',
  creating: 'Creating',
  pendingcheck: 'Pending review',
  executing: 'Executing',
  notExecuted: 'Not Executed',
  terminated: 'Terminated',
  normal: 'Common',
  locked: 'Locked',
  notActive: 'Invalid',
  expired: 'Expired',
  finished: 'Finished',
  unusual: 'Unusual',
} as const;

// 操作状态失败
const OPTIONS_STATUS_FAILED_EN_US = {
  'execute.failed': 'failed to excute {name}',
  'refresh.failed': 'failed to refresh',
  'upgrade.failed': 'failed to upgrade {name}',
  'change.failed': 'failed to change {name}',
  'commit.failed': 'failed to commit {name}',
  'install.failed': 'failed to install {name}',
  'uninstall.failed': 'failed to uninstall {name}',
  'cancel.failed': 'failed to cancel {name}',
  'save.failed': 'failed to save {name}',
  'reset.failed': 'failed to reset {name}',
  'stop.failed': 'failed to stop {name}',
  'new.failed': 'failed to new {name}',
  'create.failed': 'failed to create {name}',
  'edit.failed': 'failed to edit {name}',
  'modify.failed': 'failed to modify {name}',
  'delete.failed': 'failed to delete {name}',
  'enable.failed': 'failed to enable {name}',
  'disable.failed': 'failed to disable {name}',
  'export.failed': 'failed to export {name}',
  'import.failed': 'failed to import {name}',
  'rename.failed': 'failed to rename {name}',
  'copy.failed': 'failed to cpoy {name}',
  'check.failed': 'failed to check {name}',
  'signIn.failed': 'failed to auth',
  'search.failed': 'failed to search {name}',
  'loadMore.failed': 'failed to load',
  'update.failed': 'failed to update {name}',
  failed: 'failed',
} as const;

// 操作状态成功
const OPTIONS_STATUS_SUCCESS_EN_US = {
  'execute.success': 'successfully excute {name}',
  'refresh.success': 'successfully refresh',
  'upgrade.success': 'successfully upgrade {name}',
  'change.success': 'successfully change {name}',
  'commit.success': 'successfully commit {name}',
  'install.success': 'successfully install {name}',
  'uninstall.success': 'successfully uninstall {name}',
  'cancel.success': 'successfully cancel {name}',
  'save.success': 'successfully save {name}',
  'reset.success': 'successfully reset {name}',
  'stop.success': 'successfully stop {name}',
  'new.success': 'successfully new {name}',
  'create.success': 'successfully create {name}',
  'edit.success': 'successfully edit {name}',
  'modify.success': 'successfully modify {name}',
  'delete.success': 'successfully delete {name}',
  'enable.success': 'successfully enable {name}',
  'disable.success': 'successfully disable {name}',
  'export.success': 'successfully export {name}',
  'import.success': 'successfully import {name}',
  'rename.success': 'successfully rename {name}',
  'copy.success': 'successfully cpoy {name}',
  'check.success': 'successfully check {name}',
  'signIn.success': 'successfully auth',
  'search.success': 'successfully search {name}',
  'loadMore.success': 'successfully load',
  'update.success': 'successfully update {name}',
  success: 'success',
} as const;

// 语言
const LANGUAGES_EN_US = {
  // languages
  zh_CN: 'Chinese',
  en_US: 'English(US)',
  language: 'Languages',
} as const;

// 用户相关
const USER_EN_US = {
  username: 'Username',
  personal: 'Personal',
  personalInfo: 'Personal Info',
  password: 'Password',
  accountLogin: 'Account Login',
  mobileLogin: 'Mobile Login',
  account: 'Login Account',
  email: 'Email',
  forgetPassword: 'Forgot Password',
} as const;

// 单位相关
const UNIT_ZH_CN = {
  'unit.people': 'people',
  'unit.times': '{number} time',
} as const;
// 人物
const CHARACTER_ZH_CN = {
  organizationAdmin: 'Organization Administrator',
  user: 'User',
  projectOwner: 'Project Owner',
  projectMember: 'Project Member',
  organizationOwner: 'Organization owner',
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
  mobilephone: 'Tel',
  field: 'Field',

  transaction: 'Transaction',
  task: 'Task',
  principal: 'Owner',
  stage: 'Stage',
  client: 'Client',

  yes: 'Yes',
  no: 'No',
  application: 'APP',
  permissions: 'Permission Assignment',
  iknow: 'I know',
  version: 'Version',
  file: 'File',
  available: 'Available',
  unavailable: 'Unavailable',
  log: 'Log',
  ingress: 'Ingress',
  address: 'Address',
  path: 'Path',
  captcha: 'Captcha',
  annotation: 'Annotation',
  routing: 'Routing',
  branch: 'Branch',
  tag: 'Tag',
  name: 'Name',
  code: 'Code',
  description: 'Description',
  number: 'Number',
  color: 'Color',
  startTime: 'Start Time',
  createTime: 'Creation Time',
  operation: 'Operation',
  states: 'Status',
  source: 'Source',
  role: 'Role',
  creator: 'Creator',
  creationTime: 'Creation Time',
  updater: 'Updater',
  updateTime: 'Update Time',
  appService: 'Application Services',
  components: 'Components',
  filter: 'Filter',
  filters: 'Filters',
  issues: 'Issues',
  gantt: 'Gantt',
  legend: 'Legend',
  issue: 'Issue',
  environment: 'Environment',
  automation: 'Automation',
  assignees: 'Assignees',
  personalFilter: 'Personal Filter',
  quickFilters: 'Quick Filters',
  knowledgeBase: 'Knowledge Base',
  artifactRepository: 'Artifact Repository',
  documentLibrary: 'Document Library',
  starProjects: 'Star Projects',
  project: 'Project',
  demand: 'Demand',

  note: 'Note',
  recentUse: 'Recently Used',
  pleaseSearch: 'Please Search',
  peopleNum: 'The number of people',
  time: 'Time',
  date: 'Date',
  allPeople: 'the total number of people',
  statistical: ' statistical',
  times: 'time',
  allTimes: 'total degree',
  updateDate: 'update date',
  createDate: 'create date',
  assignRootPermission: 'assign root permission',
  assignPermissions: 'assign permissions',
  assignRoles: 'assign poles',
  createOrganization: 'create organization',
  enableOrganization: 'enable organization',
  stopOrganization: 'stop organization',
  unlockUser: 'unlock user',
  enableUser: 'enable user',
  disableUser: 'disable user',
  deleteOrganizationAdminRole: 'delete the organization administrator role',
  addOrganizationAdminRole: 'add an organization administrator role',
  createProject: 'create project',
  enableProject: 'enable project',
  disableProject: 'disable project',
  createUser: 'create user',
  approvalRegister: 'approval register',
  traffic: 'traffic',
  detail: 'details',
  complete: 'complete',
  all: 'all',
  allow: 'allow',
  ban: 'ban',
} as const;

export { COMMON_EN_US };
