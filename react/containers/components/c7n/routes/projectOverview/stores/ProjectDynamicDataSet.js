import { projectDynamicApiConfig } from '../components/project-dynamic/api';

const ProjectDynamicDataSet = ({
  projectId, startedRecord, organizationId, projectDynamicSearchDs,
}) => ({
  paging: true,
  autoQuery: false,
  pageSize: 20,
  transport: {
    read: ({ params, data }) => projectDynamicApiConfig.loadProjectDynamic({ params, data }),
  },
});

export default ProjectDynamicDataSet;
