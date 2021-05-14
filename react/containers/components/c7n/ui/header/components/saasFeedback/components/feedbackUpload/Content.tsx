import { observer } from 'mobx-react-lite';
import React, { useCallback, useRef, useState } from 'react';
import {
  Button, Icon, Spin,
} from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import Choerodon from '@/utils/choerodon';

import './index.less';
import { map } from 'lodash';
import classNames from 'classnames';
import { useSaaSFeedbackUploadStore } from './stores';
import { useSaaSFeedbackFormStore } from '../feedbackForm/stores';
import FileItem from './FileItem';
import upload from './stores/defaultFn';

const prefixCls = 'c7ncd-saas-feedbackUpload';

const FeedbackUpload = () => {
  const {
    organizationId,
  } = useSaaSFeedbackUploadStore();

  const {
    formStore,
  } = useSaaSFeedbackFormStore();

  const uploadRef = useRef<any>();

  const [tempFileName, setFilename] = useState('');

  const [isUpload, setIsupload] = useState<boolean>(false);

  function handleUploadSuccess(response: any, file: any) {
    formStore.attribute(file?.uid, 'src', response);
    formStore.modifyFileStatus(file?.uid, file?.status);
  }

  function handleUploadBefore(file:any, fileList:any[]) {
    return true;
  }

  const newFileToStore = (file:any) => {
    const fileObj = {
      file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      percent: 0,
      uid: file?.uid,
      status: file?.status,
      xhr: file?.xhr,
    };
    formStore.pushFile(fileObj);
  };

  function handleUploadProgress({ event, file, fileList }:any) {
    const {
      percent,
      originFileObj,
    } = file;
    if (Math.ceil(percent) === 100) {
      setIsupload(false);
    } else {
      !isUpload && setIsupload(true);
    }
    formStore.modifyFilePercent(file?.uid, percent);
  }

  function handleUploadFileChange(fileList: any[]) {
    console.log(fileList);
  }

  function handUploadFileError(error: Error, response: any, file: any) {
    formStore.attribute(file?.uid, 'error', JSON.stringify(response));
    formStore.modifyFileStatus(file?.uid, 'error');
  }

  const uploadConfig = {
    showUploadList: false,
    beforeUpload: handleUploadBefore,
    name: 'file',
    // @ts-expect-error
    action: `${window._env_.API_HOST}/hfle/v1/${organizationId}/files/multipart?bucketName=stress-test-csv&fileName=${tempFileName}`,
    headers: {
      Authorization: `bearers ${Choerodon.getCookie('access_token')}`,
    },
    onSuccess: handleUploadSuccess,
    onChange: handleUploadProgress,
    onError: handUploadFileError,
    multiple: true,
    customRequest(options:any) {
      upload(options, newFileToStore);
    },
  };

  const deleteCallback = useCallback((uid:string) => {
    formStore.deleteFile(uid);
  }, []);

  const abortCallback = useCallback((file:any, fileLists:any, xhr:any) => {
    formStore.attribute(file?.uid, 'status', 'canceled');
    if (fileLists.length === 1) {
      setIsupload(false);
    } else {
      const uploadingFile = fileLists.filter((value:any) => !value.status && value.uid !== file.uid);
      if (uploadingFile.length === 0) {
        setIsupload(false);
      }
    }
  }, []);

  const renderFiles = useCallback(() => map(formStore.fileLists, (value:any) => {
    const {
      fileName,
      status,
      percent,
      error,
      uid,
      ...res
    } = value;
    return <FileItem {...res} abortCallback={(xhr:any) => abortCallback(value, formStore.fileLists, xhr)} key={uid} deleteCallback={() => deleteCallback(uid)} error={error} status={status} prefixCls={prefixCls} fileName={fileName} percent={percent} />;
  }), [abortCallback, deleteCallback, formStore.fileLists]);

  const innerTextCls = classNames(`${prefixCls}-text`, {
    [`${prefixCls}-text-disabled`]: isUpload,
  });

  return (
    <div className={`${prefixCls}`}>
      <Upload
        disabled={isUpload}
        ref={uploadRef}
        {...uploadConfig}
      >
        <div className={innerTextCls}>
          {isUpload ? <Spin />
            : <Icon type="file_upload" />}
          <span>
            上传附件
          </span>
        </div>
      </Upload>
      <div className={`${prefixCls}-lists`}>
        {renderFiles()}
      </div>
    </div>
  );
};

export default observer(FeedbackUpload);
