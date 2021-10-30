import { PENDING, SUCCESS, FAILURE } from './stores/CONSTANTS';

type PermissionStatusProps = typeof PENDING | typeof SUCCESS | typeof FAILURE;

type judgeServiceProps = {
  code:string,
  type?:Pick<PermissionProps, 'type'>,
  organizationId:Pick<PermissionProps, 'organizationId'>,
  projectId:Pick<PermissionProps, 'projectId'>,
}

type PermissionType = 'site' | 'organization' | 'project' | string

type PermissionService = string[];

type PermissionProps = {
  service?: PermissionService
  type?: PermissionType
  projectId?:string | number
  organizationId?:string | number
  defaultChildren?:React.ReactElement
  noAccessChildren?:React.ReactElement
  onAccess?:CallableFunction
  AppState?:any
  [fields:string]:any
}

export {
  PermissionProps,
  judgeServiceProps,
  PermissionStatusProps,
  PermissionType,
  PermissionService,
};
