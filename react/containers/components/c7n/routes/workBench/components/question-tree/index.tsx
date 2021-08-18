import React, { useCallback, useMemo } from 'react';
import { Avatar, Tree } from 'choerodon-ui';
import { map } from 'lodash';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { getRandomBackground } from '@/containers/components/c7n/util';
import QuestionNode from '../question-node';

import './index.less';

const { TreeNode } = Tree;

export interface TreeItemProps {
  parentId?: string,
  projectId: number,
  children?: Array<TreeItemProps | never>,
  projectVO?: { name: string, imageUrl: string }
}

interface QuestionTreeProps {
  treeData: { [key: number]: TreeItemProps[] },
  organizationId: number,
  isStar?: boolean,
  switchCode?: string,
  idField?: string,
}

interface ProjectProps {
  name: string,
  imageUrl: string,
  creationDate: string,
}

const QuestionTree = ({
  treeData, organizationId, isStar = false, switchCode = 'all', idField = 'issueId',
}: QuestionTreeProps) => {
  const history = useHistory();
  const prefixCls = useMemo(() => 'c7ncd-workbench-question-tree', []);
  const nodeRenderer = (item: TreeItemProps) => (
    <QuestionNode
      // @ts-ignore
      record={item}
      organizationId={organizationId}
      history={history}
      switchCode={switchCode}
      isStar={isStar}
    />
  );

  const renderTreeNodes = (data: TreeItemProps[]) => data.map((item: TreeItemProps) => {
    if (item.children) {
      return (
        <TreeNode
          title={nodeRenderer(item)}
          // @ts-ignore
          key={item[idField]}
        >
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        // @ts-ignore
        key={item[idField]}
        title={nodeRenderer(item)}
      />
    );
  });

  const getProjectAvatar = (projectVO: ProjectProps) => {
    const { name: projectName, imageUrl, creationDate } = projectVO || {};
    const unix = String(moment(creationDate).unix());
    return (
      <div
        className={`${prefixCls}-project-avatar`}
        style={{
          backgroundImage: imageUrl
            ? `url("${imageUrl}")`
            : getRandomBackground(unix.substring(unix.length - 3)),
        }}
      >
        {!imageUrl && projectName && projectName.slice(0, 1)}
      </div>
    );
  };

  return (
    map(treeData, (item) => {
      // @ts-ignore
      const projectVO: ProjectProps = item && item[0]?.projectVO || {};
      return (
        <>
          <div className={`${prefixCls}-project`}>
            {getProjectAvatar(projectVO)}
            <span>{projectVO?.name}</span>
          </div>
          <Tree
            className={`${prefixCls}-content`}
          >
            {renderTreeNodes(item)}
          </Tree>
        </>
      );
    })
  );
};

export default QuestionTree;
