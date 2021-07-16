export interface NoticeDTO {
  id: string;
  title: string;
  content: string;
  sendDate: string;
  status: string;
  sticky: boolean;
  endDate: string;
  objectVersionNumber: number;
}

export interface NoticeVO {
  id: string;
  title: string;
  // 公告内容
  content: string;
  // 公告概览
  contentOverview: string;
  // 发送日期
  sendDate: string;
  // 完整发送时间
  sendDateFull: string;
  status: string;
  sticky: boolean;
  endDate: string;
  objectVersionNumber: number;
  // 发送人信息
  sendByUser?: {
    imageUrl: string;
    realName: string;
  }
}
