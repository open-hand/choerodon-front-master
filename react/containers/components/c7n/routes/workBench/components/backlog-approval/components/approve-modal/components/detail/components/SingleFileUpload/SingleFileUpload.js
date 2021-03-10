/* eslint-disable no-const-assign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'choerodon-ui';
import { Modal, Progress } from 'choerodon-ui/pro';
import FileSaver from 'file-saver';
import Preview from './Preview';
import './SingleFileUpload.less';

const previewSuffix = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'jpg', 'jpeg', 'gif', 'png'];
const modalKey = Modal.key();
function getFileSuffix(fileName) {
  return fileName.replace(/.+\./, '').toLowerCase();
}

function SingleFileUplaod(props) {
  const {
    url, fileService, fileName, hasDeletePermission, onDeleteFile, percent, error, onPreview, isUI,
  } = props;

  const handleDownLoadFile = () => {
    FileSaver.saveAs(`${fileService || ''}${url}`, fileName);
  };

  const handlePreviewClick = (service, name, fileUrl) => {
    if (onPreview) {
      onPreview();
    } else {
      Modal.open({
        key: modalKey,
        title: '预览',
        footer: (okBtn, cancelBtn) => null,
        className: 'c7n-agile-preview-Modal',
        cancelText: '关闭',
        fullScreen: true,
        children: <Preview service={service} fileName={name} fileUrl={fileUrl} handleDownLoadFile={handleDownLoadFile} />,
      });
    }
  };

  const previewAble = ((url && previewSuffix.includes(getFileSuffix(url))) || isUI);
  return (
    <div className="c7n-agile-singleFileUpload-container">
      <div className="c7n-agile-singleFileUpload">
        <span
          className={`c7n-agile-singleFileUpload-fileName ${previewAble ? 'preview' : ''}`}
          onClick={previewAble && handlePreviewClick.bind(this, fileService, fileName, url)}
          style={{
            cursor: previewAble ? 'pointer' : 'unset',
          }}
        >
          {previewAble && (
            <Tooltip title="预览">
              <Icon
                type="zoom_in"
                className="c7n-agile-singleFileUpload-icon"
                style={{ cursor: 'pointer', marginTop: -2 }}
              />
            </Tooltip>
          )}
          {fileName}
        </span>
        {
          url && (
          <a
            className="c7n-agile-singleFileUpload-download"
            style={{
              marginLeft: 4,
            }}
            onClick={handleDownLoadFile}
          >
            <span className="c7n-agile-singleFileUpload-icon">
              <Tooltip title="下载">
                <Icon type="get_app" style={{ color: '#000' }} />
              </Tooltip>
            </span>
          </a>
          )
        }
        {(hasDeletePermission && onDeleteFile && (url || error)) && (
          <Tooltip title="删除">
            <Icon
              type="close"
              onClick={() => { onDeleteFile(); }}
            />
          </Tooltip>
        )}
      </div>
      { percent > 0 && (
        <div className={`c7n-agile-singleFileUpload-process ${error ? 'c7n-agile-singleFileUpload-errorProcess' : ''}`}>
          <Progress
            value={Number(percent.toFixed(2))}
            className="c7n-agile-singleFileUpload-process-progress"
            status={error ? 'exception' : 'active'}
          />
        </div>
      )}
    </div>
  );
}

SingleFileUplaod.defaultProps = {
  hasDeletePermission: false,
};

export default SingleFileUplaod;
