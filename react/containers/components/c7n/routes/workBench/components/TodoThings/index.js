import React from 'react';
import Card from '../card';
import Check from '../check';
import Doc from '../doc';

import './index.less';

const StarTargetPro = () => (
  <div className="c7n-workbench-todo">
    <Card
      title="待审核"
      className="c7n-workbench-check"
    >
      <Check />
    </Card>
    {/*<Card*/}
    {/*  title="文档"*/}
    {/*  showLink*/}
    {/*  pathname="/ddd"*/}
    {/*  className="c7n-workbench-doc"*/}
    {/*>*/}
    {/*  <Doc />*/}
    {/*</Card>*/}
  </div>
);

export default StarTargetPro;
