import React from 'react';
import './index.less';

interface IProps{
 children:React.ReactElement
}
const Index:React.FC<IProps> = (props:IProps) => {
  const { children } = props;
  // 指定类的前缀
  const prefix = 'mobileRegister';

  return (
    <div className={`${prefix}-wrapper`}>
      <div className="top" />
      {children}
    </div>
  );
};

export default Index;
