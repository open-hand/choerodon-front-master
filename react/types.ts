import type { ModalProps } from 'choerodon-ui/pro/lib/modal/Modal';
/**
 * Modal.open 打开后内部children可以访问到的Props
 */
export interface IModalProps extends ModalProps {
    handleOk: (promise: () => Promise<boolean>) => Promise<void>;
    handleCancel: (promise: () => Promise<boolean>) => Promise<void>;
    close: (destroy?: boolean) => void;
    update: (modalProps: ModalProps) => void;
}
/**
 * 使用 `Modal.open`打开后注入到`children`的Props
 */
export interface IModalInjectProps {
    modal?: IModalProps;
}

export interface User {
  email: string
  enabled?: boolean
  id: string
  imageUrl: string | null
  ldap: boolean
  loginName: string
  realName: string
  name?: string
}

export interface IIssueType {
  colour: string,
  description: string,
  icon: string,
  id: string,
  name: string,
  stateMachineId: string,
  typeCode: string,
  enabled: boolean
}
/**
 * 后端返回的日志单条数据结构
 * 目前在 测试/敏捷 中使用
 */
export interface ILog {
  logId: string,
  field: string,
  fieldName: string,
  oldString: string,
  oldValue: any,
  newString: string,
  newValue: any,
  lastUpdateDate: string,
  email: string,
  lastUpdatedBy: string,
  name: string,
  loginName: string,
  realName: string,
  imageUrl: string,
  user: User,
  newStatus?: string,
  trigger?: string,
  removeResolution?: boolean,
  resolutionChanged?: boolean,
  ruleName?: string,
}
/**
 * Action的数据体
 */
export interface IBootActionDataItem {
  service?: string[]
  disabled?: boolean
  text?: React.ReactNode
  action?: Function /** 单独触发 */
  icon?: string
}
/**
 * Premission组件Props
 */
export interface IBootPermissionProps {
  service: string[]
  organizationId?: string
  projectId?: string | number
  type?: string
}
