const modulesMapping = {
  GENERAL: ['onlineMember'],
  N_DEVOPS: [
    'appService',
    'env',
    'requestChart',
    'pipelineChart',
    'commitChart',
    'deployChart',
  ],
  N_AGILE: [
    'sprintNotDone', 'sprintCount', 'burnDownChart', 'defectTreatment',
    'defectChart', 'assigneeChart', 'priorityChart', 'issueTypeChart',
    'issueTable', 'projectDynamic', 'personalWorkload', 'workLoad',
    'issueProgress', 'featureProgress',
  ],
  N_PROGRAM: [
    'issueProgress', 'featureProgress',
  ],
  N_WATERFALL: [
    'overviewCard', 'milestoneCard',
  ],
};

export default modulesMapping;
