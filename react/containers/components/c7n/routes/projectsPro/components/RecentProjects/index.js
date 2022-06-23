// import React from 'react';
// import { Icon } from 'choerodon-ui';
// import TimeAgo from 'timeago-react';
// import { observer } from 'mobx-react-lite';
// import handleClickProject from '@/utils/gotoProject';
// import { useProjectsProStore } from '../../stores';
// import ProjectTaskContent from '../projectTaskContent';

// import './index.less';

// export default observer(() => {
//   const {
//     history,
//     ProjectsProUseStore,
//     formatProject,
//   } = useProjectsProStore();

//   const renderProjects = () => ProjectsProUseStore.getRecentProjects?.map((p) => {
//     if (!p || !p.projectDTO) {
//       return null;
//     }
//     const r = p.projectDTO || {};
//     return (
//       <div
//         role="none"
//         key={p.projectId}
//         onClick={() => {
//           if (r.enabled) {
//             handleClickProject(r, history);
//           }
//         }}
//         className="recentProjects-content"
//         style={{
//           cursor: r.enabled ? 'pointer' : 'not-allowed',
//         }}
//       >
//         <div className="recentProjects-content-time">
//           <span>
//             <Icon type="date_range-o" />
//           </span>
//           <p>
//             <TimeAgo datetime={p.lastVisitTime} locale="zh_CN" />
//           </p>
//           <p style={{ marginLeft: 5 }}>使用</p>
//         </div>
//         <ProjectTaskContent data={r} />
//       </div>
//     );
//   });

//   return (
//     <div className="recentProjects">
//       <div className="recentProjects-title-wrap">
//         <p className="recentProjects-title">{formatProject({ id: 'recentUse' })}</p>
//       </div>
//       <div className="recentProjects-content-wrap">
//         {renderProjects()}
//       </div>
//     </div>
//   );
// });
import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Droppable, Draggable, DragDropContext,
} from 'react-beautiful-dnd';
import handleClickProject from '@/utils/gotoProject';
import { useProjectsProStore } from '../../stores';
import ProjectTaskContent from '../projectTaskContent';

import './index.less';
import { useFormatMessage, useFormatCommon } from '@/hooks';

export default observer(() => {
  const {
    ProjectsProUseStore,
    AppState,
    history,
  } = useProjectsProStore();

  const workbenchIntlPrefix = 'workbench';

  const formatWorkbench = useFormatMessage(workbenchIntlPrefix);
  const formatCommon = useFormatCommon();

  const renderProjects = useCallback(() => ProjectsProUseStore.getRecentProjects.map((p, index) => (
    <div
      role="none"
      onClick={() => {
        if (p.enabled) {
          handleClickProject(p, history);
        }
      }}
      className="recentProjects-items"
    >
      <div className="recentProjects-items-topborder" />
      <ProjectTaskContent alltrue data={p.projectDTO || {}} lastVisitTime={p.lastVisitTime} />
    </div>

  )), [ProjectsProUseStore.getRecentProjects, history]);

  return (
    <div className="recentProjects">
      <div className="recentProjects-title-wrap">
        <p className="recentProjects-title">
          最近使用项目
        </p>
      </div>
      <div
        className="recentProjects-content-wrap"
      >
        {renderProjects()}
      </div>

    </div>
  );
});
