import { observer } from 'mobx-react-lite';
import React, { useCallback, useRef } from 'react';
import { Icon, Spin } from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';

const FileItem = (props:any) => {
  const {
    fileName,
    percent,
    prefixCls,
    status,
    error,
    src,
    deleteCallback,
    xhr,
    abortCallback,
  } = props;

  const ref = useRef<any>();

  const getWidth = useCallback(() => {
    if (ref && ref.current) {
      const offsetWidth = ref.current?.offsetWidth;
      const width = Math.ceil((offsetWidth / 100) * percent);
      return width;
    }
    return 0;
  }, [percent]);

  const renderIcon = () => {
    let icon:React.ReactNode;
    switch (status) {
      case 'error':
        icon = (
          <a target="__blank">
            <Tooltip title={error || 'file is canceled'}>
              <Icon type="info" />
            </Tooltip>
          </a>
        );
        break;
      case 'canceled':
        icon = (
          <a target="__blank">
            <Tooltip title="file is canceled">
              <Icon type="info" />
            </Tooltip>
          </a>
        );
        break;
      case 'success':
        icon = (
          <a href={src || '#'} target="__blank">
            <Icon type="link" />
          </a>
        );
        break;
      default:
        icon = (
          <>
            <div
              className={`${prefixCls}-lists-fileItem-loadingProgress`}
              style={{
                width: `${getWidth()}px`,
              }}
            >
              <div className={`${prefixCls}-lists-fileItem-loadingProgress-percent`} />
            </div>
            <Spin />
          </>
        );
        break;
    }
    return icon;
  };

  const renderStatusBtn = () => {
    let btn:React.ReactNode;
    switch (status) {
      case 'success':
        btn = (
          <Icon
            type="delete_forever-o"
            onClick={
              () => deleteCallback(props)
            }
          />
        );
        break;
      case 'error':
        btn = (
          <Icon
            type="delete_forever-o"
            onClick={
                () => deleteCallback(props)
              }
          />
        );
        break;
      case 'canceled':
        btn = (
          <>
            {/* <Tooltip title="重新上传">
              <Icon
                type="refresh"
              />
            </Tooltip> */}
            <Icon
              type="delete_forever-o"
              onClick={
                () => deleteCallback(props)
              }
            />
          </>
        );
        break;
      default:
        btn = (
          <Tooltip title="取消上传">
            <Icon
              type="close"
              onClick={() => {
                xhr.abort();
                if (typeof abortCallback === 'function') {
                  abortCallback(xhr);
                }
              }}
            />
          </Tooltip>
        );
        break;
    }
    return btn;
  };

  return (
    <div className={`${prefixCls}-lists-fileItem`} ref={ref}>
      {
        renderIcon()
      }
      <span>
        {fileName}
      </span>
      {renderStatusBtn()}
    </div>
  );
};

export default observer(FileItem);
