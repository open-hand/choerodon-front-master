import { projectDynamicApiConfig } from '../api';

const ProjectDynamicDataSet = () => ({
  paging: true,
  autoQuery: false,
  pageSize: 20,
  transport: {
    read: ({ params, data }) => projectDynamicApiConfig.loadProjectDynamic({ params, data }),
  },
});

export default ProjectDynamicDataSet;
