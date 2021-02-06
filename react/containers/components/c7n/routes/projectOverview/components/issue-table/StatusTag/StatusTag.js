import React, { Component } from 'react';
import './StatusTag.less';

const STATUS = {
  todo: '#ffb100',
  doing: '#4d90fe',
  done: '#00bfa5',
  prepare: '#F67F5A',
};
class StatusTag extends Component {
  renderStatusBackground = (categoryCode) => {
    switch (categoryCode) {
      case 'todo':
        return 'rgb(255, 177, 0)';
      case 'doing':
        return 'rgb(77, 144, 254)';
      case 'done':
        return 'rgb(0, 191, 165)';
      case 'prepare':
        return '#F67F5A';
      default:
        return 'gray';
    }
  };

  render() {
    const {
      name,
      color,
      data,
      style,
      categoryCode,
    } = this.props;
    return (
      <div
        className="c7n-statusTag"
        style={{
          background: color || (categoryCode && this.renderStatusBackground(categoryCode)) || (data && STATUS[data.type]) || 'transparent',
          lineHeight: '20px',
          height: '20px',
          ...style,
        }}
      >
        <div style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: '#fff',
        }}
        >
          {name || (data && data.name) || ''}
        </div>
      </div>
    );
  }
}
export default StatusTag;
