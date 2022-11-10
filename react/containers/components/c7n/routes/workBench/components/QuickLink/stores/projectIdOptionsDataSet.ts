import { organizationsApiConfig } from '@/apis';

export default (userId: string) => ({
  autoQuery: true,
  paging: true,
  pageSize: 10,
  transport: {
    read: ({ data }: { data: any }) => organizationsApiConfig.getProjectsIds(userId, data?.name || ''),
  },
});
