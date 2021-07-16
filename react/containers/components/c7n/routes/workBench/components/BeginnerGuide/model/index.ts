export interface Response<T>{
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  content: T[];
  empty: boolean;
}

export interface GuideDTO {
  id: number;
  code: string;
  title: string;
  userGuideStepVOList: UserGuideStepDTO[];
}

export interface UserGuideStepDTO{
  stepName: string;
  description: string;
  docUrl: string;
  pageUrl: string;
  stepOrder: number;
  permissionId: number;
  permitted: null;
}

export type GuideVO = GuideDTO
