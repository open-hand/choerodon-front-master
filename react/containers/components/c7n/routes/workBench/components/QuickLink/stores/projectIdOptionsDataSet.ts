import { organizationsApiConfig } from '@/apis';

export default (userId:string) => ({
  autoQuery: true,
  paging: true,
  pageSize: 10,
  transport: {
    read: () => organizationsApiConfig.getProjectsIds(userId),
  },
});
