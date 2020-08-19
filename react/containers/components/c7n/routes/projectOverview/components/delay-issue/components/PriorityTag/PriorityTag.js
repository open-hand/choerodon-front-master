import React, { Component } from 'react';
import './PriorityTag.less';

function PriorityTag({ priority, style }) {
  return (
    <div
      style={style}
      className="c7n-priorityTag-container"
    >
      <div
        className="c7n-priorityTag"
        style={{
          backgroundColor: `${priority ? priority.colour : '#FFFFFF'}1F`,
          color: priority ? priority.colour : '#FFFFFF',
        }}
      >
        {priority ? priority.name : ''}
      </div>
    </div>
  );
}

export default PriorityTag;
