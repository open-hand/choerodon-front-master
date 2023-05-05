import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { TEMPLATE_CODE } from '@/constants/TEMPLATE_CODE';

import stores from '@/containers/stores';

const {
  AppState,
} = stores;

const templateCodeObj = [{
  name: '项目概览配置',
  code: TEMPLATE_CODE['agile/project-overview.config'],
  display: true,
}, {
  name: '刷新',
  code: TEMPLATE_CODE['agile/project-overview.refresh'],
  display: true,
}, {
  name: '创建工作项',
  code: TEMPLATE_CODE['agile/wbs.create'],
  display: true,
}, {
  name: '基线对比',
  code: TEMPLATE_CODE['agile/wbs.baseline'],
  display: false,
}, {
  name: '导出',
  code: TEMPLATE_CODE['agile/wbs.export'],
  display: true,
}, {
  name: '导入',
  code: TEMPLATE_CODE['agile/wbs.import'],
  display: true,
}, {
  name: '全部收起/展开',
  code: TEMPLATE_CODE['agile/wbs.expandAll'],
  display: true,
}, {
  name: '更多操作/列配置',
  code: TEMPLATE_CODE['agile/wbs.more'],
  display: false,
}, {
  name: '全屏',
  code: TEMPLATE_CODE['agile/wbs.fullScreen'],
  display: true,
}, {
  name: '刷新',
  code: TEMPLATE_CODE['agile/wbs.refresh'],
  display: true,
}, {
  name: '保存筛选',
  code: TEMPLATE_CODE['agile/wbs.saveFilter'],
  display: false,
}, {
  name: '工作项详情-登记工作日志',
  code: TEMPLATE_CODE['agile/wbs.registerWorkLog'],
  display: false,
}, {
  name: '工作项详情-评论',
  code: TEMPLATE_CODE['agile/wbs.commentWorkLog'],
  display: false,
}, {
  name: '工作项详情-复制工作项',
  code: TEMPLATE_CODE['agile/wbs.copyWorkItemWorkLog'],
  display: true,
}, {
  name: '工作项详情-删除',
  code: TEMPLATE_CODE['agile/wbs.deleteWorkItemWorkLog'],
  display: true,
}, {
  name: '工作项详情-登记工作',
  code: TEMPLATE_CODE['agile/wbs.registerWork'],
  display: false,
}, {
  name: '列表-修改概要',
  code: TEMPLATE_CODE['agile/wbs.modifySummary'],
  display: true,
}, {
  name: '列表-创建子项',
  code: TEMPLATE_CODE['agile/wbs.createSubIssue'],
  display: true,
}, {
  name: '列表-设置依赖关系',
  code: TEMPLATE_CODE['agile/wbs.setRelation'],
  display: true,
}, {
  name: '登记风险',
  code: TEMPLATE_CODE['agile/pro-risk.register'],
  display: true,
}, {
  name: '个人筛选',
  code: TEMPLATE_CODE['agile/pro-risk.personalFilter'],
  display: false,
}, {
  name: '刷新',
  code: TEMPLATE_CODE['agile/pro-risk.refresh'],
  display: true,
}, {
  name: '保存筛选',
  code: TEMPLATE_CODE['agile/pro-risk.saveFilter'],
  display: false,
}, {
  name: '列配置',
  code: TEMPLATE_CODE['agile/pro-risk.columnConfig'],
  display: false,
}, {
  name: '创建工作项',
  code: TEMPLATE_CODE['agile/scrumboard.create'],
  display: true,
}, {
  name: '更多操作/配置看板',
  code: TEMPLATE_CODE['agile/scrumboard.more'],
  display: true,
}, {
  name: '更多操作/个人筛选',
  code: TEMPLATE_CODE['agile/scrumboard.personalFilter'],
  display: false,
}, {
  name: '全屏',
  code: TEMPLATE_CODE['agile/scrumboard.fullScreen'],
  display: true,
}, {
  name: '刷新',
  code: TEMPLATE_CODE['agile/scrumboard.refresh'],
  display: true,
}, {
  name: '切换看板',
  code: TEMPLATE_CODE['agile/scrumboard.switch'],
  display: true,
}, {
  name: '隐藏在历史迭代已完成的子任务',
  code: TEMPLATE_CODE['agile/scrumboard.hideSubTask'],
  display: true,
}, {
  name: '保存筛选',
  code: TEMPLATE_CODE['agile/scrumboard.saveFilter'],
  display: false,
}, {
  name: '待办事项/创建工作项',
  code: TEMPLATE_CODE['agile/work-list.create'],
  display: true,
}, {
  name: '待办事项/创建冲刺',
  code: TEMPLATE_CODE['agile/work-list.createSprint'],
  display: true,
}, {
  name: '待办事项/刷新',
  code: TEMPLATE_CODE['agile/work-list.refresh'],
  display: true,
}, {
  name: '待办事项/显示未开始冲刺',
  code: TEMPLATE_CODE['agile/work-list.showUnStartSprint'],
  display: true,
}, {
  code: TEMPLATE_CODE['agile/work-list.createEpic'],
  name: '待办事项/创建史诗',
  display: true,
}, {
  name: '所有工作项/创建工作项',
  code: TEMPLATE_CODE['agile/work-list.createAll'],
  display: true,
}, {
  name: '所有工作项/导入工作项',
  code: TEMPLATE_CODE['agile/work-list.import'],
  display: true,
}, {
  name: '所有工作项/导出工作项',
  code: TEMPLATE_CODE['agile/work-list.export'],
  display: true,
}, {
  name: '所有工作项/个人筛选',
  code: TEMPLATE_CODE['agile/work-list.personalFilter'],
  display: false,
}, {
  name: '所有工作项/刷新',
  code: TEMPLATE_CODE['agile/work-list.refreshAll'],
  display: true,
}, {
  name: '所有工作项/视图切换',
  code: TEMPLATE_CODE['agile/work-list.switchView'],
  display: true,
}, {
  name: '所有工作项/保存筛选',
  code: TEMPLATE_CODE['agile/work-list.saveFilter'],
  display: false,
}, {
  name: '所有工作项/列配置',
  code: TEMPLATE_CODE['agile/work-list.columnConfig'],
  display: false,
}, {
  name: '需求分类/创建分类',
  code: TEMPLATE_CODE['agile/demand-setting.createType'],
  display: true,
}, {
  name: '需求分类/收起全部',
  code: TEMPLATE_CODE['agile/demand-setting.collapseAll'],
  display: true,
}, {
  name: '需求分类/修改',
  code: TEMPLATE_CODE['agile/demand-setting.modify'],
  display: true,
}, {
  name: '需求类型/创建类型',
  code: TEMPLATE_CODE['agile/demand-setting.createDemandType'],
  display: true,
}, {
  name: '需求类型/修改、删除',
  code: TEMPLATE_CODE['agile/demand-setting.modifyDemandType'],
  display: true,
}];

function useProjectTemplate(codes?: any) {
  const [isTemplate, setIsTemplate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [displayList, setDisplayList] = useState([]);

  const location = useLocation();

  useEffect(() => {
    if (codes && codes.length) {
      const list: any = {};
      codes.forEach((code: any) => {
        const item = templateCodeObj?.find((i) => i.code === code);
        if (item) {
          list[code] = item.display;
        }
      });
      setDisplayList(list);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const edit = urlParams.get('edit');
    if (edit === 'true' && edit !== String(isEdit)) {
      setIsEdit(true);
    }
  }, [location.pathname + location.search]);

  useEffect(() => {
    let flag = false;
    if (AppState?.currentProject?.templateFlag) {
      flag = true;
    }
    if (flag !== isTemplate) {
      setIsTemplate(flag);
    }
  }, [AppState?.currentProject, AppState?.currentProject?.templateFlag]);

  return {
    isTemplate, isEdit, displayList,
  };
}

export default useProjectTemplate;
