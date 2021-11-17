import { TreeReduceProps } from '../interface';

/**
 * 遍历tree直至找到callback的返回值为true，停止遍历，所以这里用some遍历的好处在这
 * @param {TreeReduceProps} { tree, callback, parents = [] }
 * @return {*}  {boolean}
 */
const treeReduce = ({ tree, callback, parents = [] }:TreeReduceProps):boolean => {
  // 如果有code，说明是parent就存进parent数组
  if (tree.code) {
    parents.push(tree);
  }
  const subMenu = tree?.subMenus;
  return typeof subMenu === 'object' ? subMenu.some((node, index) => {
    const newParents = parents.slice(0);
    const tempNode = node;
    tempNode.parentName = parents[0] && parents[0].name;
    const tempSubMenu = tempNode?.subMenus;
    if (tempSubMenu && tempSubMenu.length > 0) {
      const traversTree = treeReduce({ tree: node, callback, parents: newParents });
      return traversTree;
    }
    return callback({ treeNode: node, parents, index });
  }) : false;
};

export { treeReduce };
