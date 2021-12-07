import classNames from 'classnames';
import React from 'react';
import { fileServer } from '@/utils';
import { useUserAvatarStore } from '../../stores';
import { AvatarProps } from '../../interface';

const Avatar:React.FC<AvatarProps> = (props) => {
  const {
    prefixCls,
  } = useUserAvatarStore();

  const {
    src, children, className, style, ...rest
  } = props;

  return (
    <div
      className={classNames(`${prefixCls}-avatar`, className)}
      style={
        {
          ...style,
          backgroundImage: src && `url('${fileServer(src)}')`,
        }
      }
      {...rest}
    >
      {!src && children}
    </div>
  );
};
export default Avatar;
