import React from 'react';
import pic from './emptyProject.svg';
import './Empty.less';

const Empty = ({
  style,
  loading,
  title,
  description,
  extra,
}) => (
    <div
      className="Empty"
      style={style}
    >
      <div
        className="Empty-content"
      >
        <div className="Empty-imgWrap">
          <img src={pic} alt="" className="Empty-imgWrap-img" />
        </div>
        <div
          className="Empty-textWrap"
        >
          <h1 className="Empty-title">
            {title || ''}
          </h1>
          <div className="Empty-description">
            {description || ''}
          </div>
          <div style={{ marginTop: 10 }}>
            {extra}
          </div>
        </div>
      </div>
    </div>
);
export default Empty;
