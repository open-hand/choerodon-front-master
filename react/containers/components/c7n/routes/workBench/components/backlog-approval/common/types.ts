interface Attachment {
  id: number
  fileName: string
  url: string
  createdBy: string
}

export interface User {
  email: string
  enabled?: boolean
  id: string
  imageUrl: string | null
  ldap: boolean
  loginName: string
  realName: string
  name: string,
}

export interface IComment {
  id: string
  commentText: string
  backlogId: string
  lastUpdateDate: string
  objectVersionNumber: number
  projectId: number
  userId: string
  userImageUrl: string
  userLoginName: string
  userName: string
  userRealName: string
  replySize: number
}

export interface Status {
  id: number
  name: string
  code: string
  description: string
  type: 'todo' | 'doing' | 'done'
  organizationId: string
}

export interface DemandClassification {
  children: DemandClassification[] | null,
  id: string,
  name: string,
  objectVersionNumber: number,
  parentId: string,
  projectId: number,
}
export type DemandSource = 'inside' | 'outside'
export interface DemandType {
  id: string,
  description: string
  name: string
  objectVersionNumber: number
}

export interface IPriority {
  id: number
  name: string
  description: string,
  default: boolean, // 是否设置为默认优先级
  color: string,
  sequence: number
}

export interface Demand {
  id: string
  backlogNum: string
  summary: string
  description: string
  statusId: number
  statusVO: Status
  priorityId: number
  projectId: number | string,
  attachmentVOList: Attachment[]
  creationDate: string
  lastUpdateDate: string
  objectVersionNumber: number
  backlogPriority: IPriority
  assignees: User[] | null
  createUser: User
  updateUser: User
  createdBy: string
  typeId: string,
  backlogTypeDTO: DemandType,
  backlogClassificationVO: DemandClassification,
  feedback: string,
  feedbackFrequency: number,
  source: DemandSource,
  commentProVOS: IComment[],
  progressFeedback: boolean, // 是否需要反馈
  classificationId: string,
  email?: string,
  backlogName?: string
  estimatedStartTime: string
  estimatedEndTime: string
  starBeacon: boolean
  issueTypeId: string
}

export type IFieldType =
  'text' | 'input' | 'member' | 'multiMember' | 'single' | 'multiple' | 'radio' | 'checkbox' |
  'number' | 'time' | 'date' | 'datetime'

interface IFieldOption {
    id: string
    value: string
    enabled: boolean
  }
export interface IField {
    code: string
    fieldName: string
    fieldId: string
    value: string
    fieldType: IFieldType
    fieldCode: string
    valueStr: any
    required: boolean
    fieldOptions?: IFieldOption[]
    system: boolean
    defaultValue: string | null
    defaultValueObj?: Object
  }
