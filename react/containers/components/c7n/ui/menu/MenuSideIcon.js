import React from 'react';

export default ({ name }) => (
  <svg style={{ height: 30 }} aria-hidden="true">
    <use xlinkHref={`#${name}`} />
  </svg>
);
