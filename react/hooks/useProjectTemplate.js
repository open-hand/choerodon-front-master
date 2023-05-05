import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

const templateCodeObj = {
  'agile/project-overview': [{
    name: '项目概览配置',
    code: 'project-overview.config',
    display: true,
  }, {
    name: '刷新',
    code: 'project-overview.refresh',
    display: true,
  }],
  'agile/wbs': [{
    name: '创建工作项',
    code: 'wbs.create',
    display: true,
  }, {
    name: '基线对比',
    code: 'wbs.baseline',
    display: false,
  }, {
    name: '导出',
    code: 'wbs.export',
    display: true,
  }, {
    name: '导入',
    code: 'wbs.import',
    display: true,
  }, {
    name: '全部收起/展开',
    code: 'wbs.expandAll',
    display: true,
  }, {
    name: '更多操作/列配置',
    code: 'wbs.more',
    display: false,
  }, {
    name: '全屏',
    code: 'wbs.fullScreen',
    display: true,
  }, {
    name: '刷新',
    code: 'wbs.refresh',
    display: true,
  }, {
    name: '保存筛选',
    code: 'wbs.saveFilter',
    display: false,
  }, {
    name: '工作项详情-登记工作日志',
    code: 'wbs.registerWorkLog',
    display: false,
  }, {
    name: '工作项详情-评论',
    code: 'wbs.commentWorkLog',
    display: false,
  }, {
    name: '工作项详情-复制工作项',
    code: 'wbs.copyWorkItemWorkLog',
    display: true,
  }, {
    name: '工作项详情-删除',
    code: 'wbs.deleteWorkItemWorkLog',
    display: true,
  }, {
    name: '工作项详情-登记工作',
    code: 'wbs.registerWork',
    display: false,
  }, {
    name: '列表-修改概要',
    code: 'wbs.modifySummary',
    display: true,
  }, {
    name: '列表-创建子项',
    code: 'wbs.createSubIssue',
    display: true,
  }, {
    name: '列表-设置依赖关系',
    code: 'wbs.setRelation',
    display: true,
  }],
  'agile/pro-risk': [{
    name: '登记风险',
    code: 'pro-risk.register',
    display: true,
  }, {
    name: '个人筛选',
    code: 'pro-risk.personalFilter',
    display: false,
  }, {
    name: '刷新',
    code: 'pro-risk.refresh',
    display: true,
  }, {
    name: '保存筛选',
    code: 'pro-risk.saveFilter',
    display: false,
  }, {
    name: '列配置',
    code: 'pro-risk.columnConfig',
    display: false,
  }],
  'agile/scrumboard': [{
    name: '创建工作项',
    code: 'scrumboard.create',
    display: true,
  }, {
    name: '更多操作/配置看板',
    code: 'scrumboard.more',
    display: true,
  }, {
    name: '更多操作/个人筛选',
    code: 'scrumboard.personalFilter',
    display: false,
  }, {
    name: '全屏',
    code: 'scrumboard.fullScreen',
    display: true,
  }, {
    name: '刷新',
    code: 'scrumboard.refresh',
    display: true,
  }, {
    name: '切换看板',
    code: 'scrumboard.switch',
    display: true,
  }, {
    name: '隐藏在历史迭代已完成的子任务',
    code: 'scrumboard.hideSubTask',
    display: true,
  }, {
    name: '保存筛选',
    code: 'scrumboard.saveFilter',
    display: false,
  }],
  'agile/work-list': [{
    name: '待办事项/创建工作项',
    code: 'work-list.create',
    display: true,
  }, {
    name: '待办事项/创建冲刺',
    code: 'work-list.createSprint',
    display: true,
  }, {
    name: '待办事项/刷新',
    code: 'work-list.refresh',
    display: true,
  }, {
    name: '待办事项/显示未开始冲刺',
    code: 'work-list.showUnStartSprint',
    display: true,
  }, {
    name: '待办事项/创建史诗',
    code: 'work-list.createEpic',
    display: true,
  }, {
    name: '所有工作项/创建工作项',
    code: 'work-list.createAll',
    display: true,
  }, {
    name: '所有工作项/导入工作项',
    code: 'work-list.import',
    display: true,
  }, {
    name: '所有工作项/导出工作项',
    code: 'work-list.export',
    display: true,
  }, {
    name: '所有工作项/个人筛选',
    code: 'work-list.personalFilter',
    display: false,
  }, {
    name: '所有工作项/刷新',
    code: 'work-list.refreshAll',
    display: true,
  }, {
    name: '所有工作项/视图切换',
    code: 'work-list.switchView',
    display: true,
  }, {
    name: '所有工作项/保存筛选',
    code: 'work-list.saveFilter',
    display: false,
  }, {
    name: '所有工作项/列配置',
    code: 'work-list.columnConfig',
    display: false,
  }],
  'agile/demand-setting': [{
    name: '需求分类/创建分类',
    code: 'demand-setting.createType',
    display: true,
  }, {
    name: '需求分类/收起全部',
    code: 'demand-setting.collapseAll',
    display: true,
  }, {
    name: '需求分类/修改',
    code: 'demand-setting.modify',
    display: true,
  }, {
    name: '需求类型/创建类型',
    code: 'demand-setting.createDemandType',
    display: true,
  }, {
    name: '需求类型/修改、删除',
    code: 'demand-setting.modifyDemandType',
    display: true,
  }],
};

function useProjectTemplate(appState, codes) {
  const [isTemplate, setIsTemplate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [displayList, setDisplayList] = useState([]);

  const location = useLocation();

  useEffect(() => {
    if (codes && codes.length) {
      const list = [];
      codes.forEach((item) => {
        const path = item?.path;
        const code = item?.code;
        if (path && code) {
          const template = templateCodeObj[path];
          if (template) {
            const display = template.find((t) => t.code === code)?.display;
            list.push({
              path,
              code,
              display,
            });
          }
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
    if (appState?.currentProject?.templateFlag) {
      flag = true;
    }
    if (flag !== isTemplate) {
      setIsTemplate(flag);
    }
  }, [appState?.currentProject, appState?.currentProject?.templateFlag]);

  return [isTemplate, isEdit, displayList, templateCodeObj];
}

export default useProjectTemplate;
