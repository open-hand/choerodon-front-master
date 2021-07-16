export type RescoreName = 'host' | 'cluster' | 'env';
export type RescoreTotalName = `${RescoreName}Total`;
export type RescoreGroupName = `${RescoreName}Groups`;

export type RescoreDTO = {
  [K in RescoreTotalName | RescoreGroupName] : K extends RescoreTotalName ? number : RescoreGroupDTO[];
}

export interface RescoreGroupDTO {
  groupName: string;
  count: number;
  leafFlag: boolean;
}

export interface Tip {
  title: string;
  blankLine?: boolean;
  count?: number;
  children?: Tip[];
}

export interface Card {
  name: string;
  title: string;
  data: number;
  tips?: Tip[];
}
