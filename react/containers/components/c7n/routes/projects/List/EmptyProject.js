import React from 'react';
import emptyProject from './emptyProject.svg';

export default function EmptyProject() {
  return (
    <div style={{ marginTop: '.5rem', width: '100%', textAlign: 'center' }}>
      <img src={emptyProject} alt="" />
    </div>
  );
}
