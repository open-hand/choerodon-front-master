import React, { useCallback, useMemo } from 'react';
import { Tooltip, Icon } from 'choerodon-ui/pro';
import map from 'lodash/map';
import { Popover } from 'choerodon-ui';

import './index.less';

const ProjectCategory = ({
  data = [], maxTag = 1, className, showIcon = true, style, agileWaterfall,
}) => {
  const prefixCls = useMemo(() => 'c7ncd-project-categories', []);
  const getCategory = useCallback((category) => ((agileWaterfall && category?.code === 'N_WATERFALL') ? (
    <Tooltip title="瀑布管理 (启用冲刺)">
      <span className={`${prefixCls}-tag`}>
        瀑布管理 (启用冲刺)
      </span>
    </Tooltip>
  ) : (
    <Tooltip title={category?.name}>
      <span className={`${prefixCls}-tag`}>{category?.name}</span>
    </Tooltip>
  )));

  const getCategories = useMemo(() => map(data, (category) => {
    if (category?.code !== 'N_PROGRAM_PROJECT') {
      return getCategory(category);
    }
    return null;
  }), [data]);

  return (
    <div className={`${prefixCls} ${className || ''}`} style={style}>
      {showIcon && <Icon type="project_line" className={`${prefixCls}-icon`} />}
      {getCategories && getCategories.length ? getCategories[0] : null}
      {getCategories && getCategories.length > maxTag && (
        <Popover
          placement="bottom"
          content={(
            <div className={`${prefixCls}-popover`}>
              {getCategories.slice(maxTag, getCategories.length)}
            </div>
          )}
        >
          <Icon type="keyboard_arrow_down" className={`${prefixCls}-more`} />
        </Popover>
      )}
    </div>
  );
};

export default ProjectCategory;
