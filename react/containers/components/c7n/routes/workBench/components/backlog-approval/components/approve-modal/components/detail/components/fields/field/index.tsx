import React from 'react';
import './index.less';

const prefix = 'c7n-backlogApprove-backlogDetail';

interface Props {
  label: string
}
const Field: React.FC<Props> = ({ label, children }) => (
  <div className={`${prefix}-field`}>
    <div className="label">{`${label}:`}</div>
    {children}
  </div>
);

export default Field;
