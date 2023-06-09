import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { TEMPLATE_CODE } from '@/constants/TEMPLATE_CODE';

import stores from '@/containers/stores';

const {
  AppState,
} = stores;

const templateCodeObj = [{
  name: '项目概览-配置',
  code: TEMPLATE_CODE['agile/project-overview.config'],
  display: false,
  previewDisplay: false,
}, {
  name: '项目概览-刷新',
  code: TEMPLATE_CODE['agile/project-overview.refresh'],
  display: true,
  previewDisplay: true,
}, {
  name: '创建工作项',
  code: TEMPLATE_CODE['agile/wbs.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '基线对比',
  code: TEMPLATE_CODE['agile/wbs.baseline'],
  display: false,
  previewDisplay: false,
}, {
  name: '导出',
  code: TEMPLATE_CODE['agile/wbs.export'],
  display: true,
  previewDisplay: false,
}, {
  name: '导入',
  code: TEMPLATE_CODE['agile/wbs.import'],
  display: true,
  previewDisplay: false,
}, {
  name: '全部收起/展开',
  code: TEMPLATE_CODE['agile/wbs.expandAll'],
  display: true,
  previewDisplay: true,
}, {
  name: '更多操作/列配置',
  code: TEMPLATE_CODE['agile/wbs.more'],
  display: false,
  previewDisplay: false,
}, {
  name: '全屏',
  code: TEMPLATE_CODE['agile/wbs.fullScreen'],
  display: true,
  previewDisplay: true,
}, {
  name: '刷新',
  code: TEMPLATE_CODE['agile/wbs.refresh'],
  display: true,
  previewDisplay: true,
}, {
  name: '保存筛选',
  code: TEMPLATE_CODE['agile/wbs.saveFilter'],
  display: false,
  previewDisplay: false,
}, {
  name: '工作项详情-登记工作日志',
  code: TEMPLATE_CODE['agile/wbs.registerWorkLog'],
  display: false,
  previewDisplay: false,
}, {
  name: '工作项详情-评论',
  code: TEMPLATE_CODE['agile/wbs.commentWorkLog'],
  display: false,
  previewDisplay: false,
}, {
  name: '工作项详情-复制工作项',
  code: TEMPLATE_CODE['agile/wbs.copyWorkItemWorkLog'],
  display: true,
  previewDisplay: false,
}, {
  name: '工作项详情-删除',
  code: TEMPLATE_CODE['agile/wbs.deleteWorkItemWorkLog'],
  display: true,
  previewDisplay: false,
}, {
  name: '工作项详情-登记工作',
  code: TEMPLATE_CODE['agile/wbs.registerWork'],
  display: false,
  previewDisplay: false,
}, {
  name: '列表-修改概要',
  code: TEMPLATE_CODE['agile/wbs.modifySummary'],
  display: true,
  previewDisplay: false,
}, {
  name: '列表-创建子项',
  code: TEMPLATE_CODE['agile/wbs.createSubIssue'],
  display: true,
  previewDisplay: false,
}, {
  name: '列表-设置依赖关系',
  code: TEMPLATE_CODE['agile/wbs.setRelation'],
  display: true,
  previewDisplay: false,
}, {
  name: '交付物',
  code: TEMPLATE_CODE['agile/wbs.deliverable'],
  display: true,
  previewDisplay: false,
}, {
  name: '列表-拆解为冲刺或敏捷工作项',
  code: TEMPLATE_CODE['agile/wbs.linkIssueOrSprint'],
  display: true,
  previewDisplay: false,
}, {
  name: '项目计划-行内编辑/拖拽/时间设置',
  code: TEMPLATE_CODE['agile/wbs.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '登记风险',
  code: TEMPLATE_CODE['agile/pro-risk.register'],
  display: true,
  previewDisplay: false,
}, {
  name: '个人筛选',
  code: TEMPLATE_CODE['agile/pro-risk.personalFilter'],
  display: false,
  previewDisplay: false,
}, {
  name: '刷新',
  code: TEMPLATE_CODE['agile/pro-risk.refresh'],
  display: true,
  previewDisplay: true,
}, {
  name: '保存筛选',
  code: TEMPLATE_CODE['agile/pro-risk.saveFilter'],
  display: false,
  previewDisplay: false,
}, {
  name: '列配置',
  code: TEMPLATE_CODE['agile/pro-risk.columnConfig'],
  display: false,
  previewDisplay: false,
}, {
  name: '创建工作项',
  code: TEMPLATE_CODE['agile/scrumboard.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '更多操作/配置看板',
  code: TEMPLATE_CODE['agile/scrumboard.more'],
  display: true,
  previewDisplay: false,
}, {
  name: '更多操作/个人筛选',
  code: TEMPLATE_CODE['agile/scrumboard.personalFilter'],
  display: false,
  previewDisplay: false,
}, {
  name: '全屏',
  code: TEMPLATE_CODE['agile/scrumboard.fullScreen'],
  display: true,
  previewDisplay: true,
}, {
  name: '刷新',
  code: TEMPLATE_CODE['agile/scrumboard.refresh'],
  display: true,
  previewDisplay: true,
}, {
  name: '切换看板',
  code: TEMPLATE_CODE['agile/scrumboard.switch'],
  display: true,
  previewDisplay: true,
}, {
  name: '隐藏在历史迭代已完成的子任务',
  code: TEMPLATE_CODE['agile/scrumboard.hideSubTask'],
  display: true,
  previewDisplay: false,
}, {
  name: '保存筛选',
  code: TEMPLATE_CODE['agile/scrumboard.saveFilter'],
  display: false,
  previewDisplay: false,
}, {
  name: '待办事项/创建工作项',
  code: TEMPLATE_CODE['agile/work-list.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '待办事项/创建冲刺',
  code: TEMPLATE_CODE['agile/work-list.createSprint'],
  display: true,
  previewDisplay: false,
}, {
  name: '待办事项/刷新',
  code: TEMPLATE_CODE['agile/work-list.refresh'],
  display: true,
  previewDisplay: true,
}, {
  name: '待办事项/显示未开始冲刺',
  code: TEMPLATE_CODE['agile/work-list.showUnStartSprint'],
  display: true,
  previewDisplay: false,
}, {
  code: TEMPLATE_CODE['agile/work-list.createEpic'],
  name: '待办事项/创建史诗',
  display: true,
  previewDisplay: false,
}, {
  name: '所有工作项/创建工作项',
  code: TEMPLATE_CODE['agile/work-list.createAll'],
  display: true,
  previewDisplay: false,
}, {
  name: '所有工作项/导入工作项',
  code: TEMPLATE_CODE['agile/work-list.import'],
  display: true,
  previewDisplay: false,
}, {
  name: '所有工作项/导出工作项',
  code: TEMPLATE_CODE['agile/work-list.export'],
  display: true,
  previewDisplay: false,
}, {
  name: '所有工作项/个人筛选',
  code: TEMPLATE_CODE['agile/work-list.personalFilter'],
  display: false,
  previewDisplay: false,
}, {
  name: '所有工作项/刷新',
  code: TEMPLATE_CODE['agile/work-list.refreshAll'],
  display: true,
  previewDisplay: true,
}, {
  name: '所有工作项/视图切换',
  code: TEMPLATE_CODE['agile/work-list.switchView'],
  display: true,
  previewDisplay: true,
}, {
  name: '所有工作项/保存筛选',
  code: TEMPLATE_CODE['agile/work-list.saveFilter'],
  display: false,
  previewDisplay: false,
}, {
  name: '所有工作项/列配置',
  code: TEMPLATE_CODE['agile/work-list.columnConfig'],
  display: false,
  previewDisplay: false,
}, {
  name: '需求分类/创建分类',
  code: TEMPLATE_CODE['agile/demand-setting.createType'],
  display: true,
  previewDisplay: false,
}, {
  name: '需求分类/收起全部',
  code: TEMPLATE_CODE['agile/demand-setting.collapseAll'],
  display: true,
  previewDisplay: true,
}, {
  name: '需求分类/修改',
  code: TEMPLATE_CODE['agile/demand-setting.modify'],
  display: true,
  previewDisplay: false,
}, {
  name: '需求类型/创建类型',
  code: TEMPLATE_CODE['agile/demand-setting.createDemandType'],
  display: true,
  previewDisplay: false,
}, {
  name: '需求类型/修改、删除',
  code: TEMPLATE_CODE['agile/demand-setting.modifyDemandType'],
  display: true,
  previewDisplay: false,
}, {
  name: '工作项类型-创建',
  code: TEMPLATE_CODE['agile/issueType.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '工作项类型-编辑、删除',
  code: TEMPLATE_CODE['agile/issueType.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '工作项类型-拖拽调整顺序',
  code: TEMPLATE_CODE['agile/issueType.drag'],
  display: true,
  previewDisplay: false,
}, {
  name: '工作项详情-工作日志',
  code: TEMPLATE_CODE['agile/issue-detail.workLog'],
  display: false,
  previewDisplay: false,
}, {
  name: '工作项详情-评论',
  code: TEMPLATE_CODE['agile/issue-detail.comment'],
  display: false,
  previewDisplay: false,
}, {
  name: '模块管理-创建',
  code: TEMPLATE_CODE['agile/component.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '模块管理-修改/删除',
  code: TEMPLATE_CODE['agile/component.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '快速筛选-创建',
  code: TEMPLATE_CODE['agile/fast-search.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '快速筛选-修改/删除',
  code: TEMPLATE_CODE['agile/fast-search.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '工作项链接-创建',
  code: TEMPLATE_CODE['agile/issue-link.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '工作项链接-修改/删除',
  code: TEMPLATE_CODE['agile/issue-link.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '状态机-状态-创建',
  code: TEMPLATE_CODE['agile/state-machine.state.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '状态机-状态-修改/删除',
  code: TEMPLATE_CODE['agile/state-machine.state.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '页面配置-字段-创建',
  code: TEMPLATE_CODE['agile/page-config.field.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '页面配置-字段-导入',
  code: TEMPLATE_CODE['agile/page-config.field.import'],
  display: true,
  previewDisplay: false,
}, {
  name: '页面配置-字段-列表操作',
  code: TEMPLATE_CODE['agile/page-config.field.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '页面配置-字段配置-列表操作',
  code: TEMPLATE_CODE['agile/page-config.config.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '页面配置-字段配置-添加已有字段',
  code: TEMPLATE_CODE['agile/page-config.config.add'],
  display: true,
  previewDisplay: false,
}, {
  name: '页面配置-字段模板-列表操作',
  code: TEMPLATE_CODE['agile/page-config.template.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '触发器-创建',
  code: TEMPLATE_CODE['agile/trigger.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '触发器-查看执行日志',
  code: TEMPLATE_CODE['agile/trigger.log'],
  display: true,
  previewDisplay: true,
}, {
  name: '触发器-列表操作',
  code: TEMPLATE_CODE['agile/trigger.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '设置-基础信息-修改项目',
  code: TEMPLATE_CODE['base/project-setting.edit'],
  display: true,
  previewDisplay: false,
}, {
  name: '设置-基础信息-停用项目',
  code: TEMPLATE_CODE['base/project-setting.stop'],
  display: true,
  previewDisplay: false,
}, {
  name: '设置-基础信息-设置健康状态',
  code: TEMPLATE_CODE['base/project-setting.setHealth'],
  display: true,
  previewDisplay: false,
}, {
  name: '设置-通知-协作消息-列表操作',
  code: TEMPLATE_CODE['notify/project-notify.agile.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '设置-通知-DevOps消息-列表操作',
  code: TEMPLATE_CODE['notify/project-notify.devops.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '设置-通知-资源删除验证-列表操作',
  code: TEMPLATE_CODE['notify/project-notify.resource.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '设置-通知-webhook配置-创建',
  code: TEMPLATE_CODE['notify/project-notify.webhook.create'],
  display: true,
  previewDisplay: false,
}, {
  name: '设置-通知-webhook配置-列表操作',
  code: TEMPLATE_CODE['notify/project-notify.webhook.action'],
  display: true,
  previewDisplay: false,
}, {
  name: '设置-通知-webhook配置-执行记录',
  code: TEMPLATE_CODE['notify/project-notify.webhook.log'],
  display: true,
  previewDisplay: true,
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
        if (!isTemplate) {
          list[code] = true;
        } else {
          const item = templateCodeObj?.find((i) => i.code === code);
          if (item) {
            list[code] = isEdit ? item.display : item.previewDisplay;
          }
        }
      });
      setDisplayList(list);
    }
  }, [isTemplate, isEdit]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const edit = urlParams.get('templateEdit');
    if (edit === 'true' && edit !== String(isEdit)) {
      setIsEdit(true);
    }
  }, [location.pathname + location.search]);

  useEffect(() => {
    if (AppState?.menuType?.type !== 'project') {
      setIsTemplate(false);
      return;
    }
    let flag = false;
    if (AppState?.currentProject?.templateFlag) {
      flag = true;
    }
    if (flag !== isTemplate) {
      setIsTemplate(flag);
    }
  }, [AppState?.currentProject, AppState?.currentProject?.templateFlag, AppState?.menuType?.type]);

  return {
    isTemplate, isEdit, displayList,
  };
}

export default useProjectTemplate;