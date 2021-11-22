import { LanguageGroupsProps } from './Language';

type UserInfoProps = {
  admin: boolean
  changePasswordFlag: number
  // currentRoleCode: 'project-admin'
  currentRoleId: string
  // currentRoleLabels: ['TENANT_ROLE', 'GITLAB_OWNER', 'PROJECT_ADMIN', 'TENANT_ADMIN', 'PROJECT_ROLE']
  // currentRoleLevel: 'organization'
  currentRoleName: string
  dataHierarchyFlag: number
  email: string
  emailCheckFlag: number
  favicon: string
  id: string | number
  imageUrl: string
  language: LanguageGroupsProps
  languageName: string
  lastPasswordUpdatedAt: string
  ldap: boolean
  loginName: string
  logo: string
  organizationId: number | string
  passwordResetFlag: number
  phone: string
  phoneCheckFlag: number
  realName: string
  recentAccessTenantList: any[]
  roleMergeFlag: boolean
  tenantAdminFlag: boolean
  tenantAdminRoleId: string | number
  tenantId: string | number
  tenantName: string
  title: string
}

export {
  UserInfoProps,
};
