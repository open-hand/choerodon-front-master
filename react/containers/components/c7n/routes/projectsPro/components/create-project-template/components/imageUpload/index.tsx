import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Upload,
} from 'choerodon-ui';
import {
  Icon,
  Modal,
  Button,
} from 'choerodon-ui/pro';
import Cropper from 'react-cropper';
import { DataSet } from 'choerodon-ui/pro/lib';
import querystring from 'query-string';
import axios from '@/components/axios';
import imageEmpty from '../../images/template_card_empty.png';

import 'cropperjs/dist/cropper.css';

import './index.less';

interface IProps{
  formDs:DataSet
  prefixCls:string,
  AppState:any,
  organizationId:string,
}
const CropModal = (p: any) => {
  // HTMLImageElement
  const cropperRef = useRef<any>(null);
  const {
    modal, url, handleCrop, aspectRatio,
  } = p;

  const handleZoomIn = () => {
    const cropper = cropperRef?.current?.cropper;
    cropper.zoom(0.1);
  };

  const handleZoomout = () => {
    const cropper = cropperRef?.current?.cropper;
    cropper.zoom(-0.1);
  };

  const handleRotate = () => {
    const cropper = cropperRef?.current?.cropper;
    cropper.rotate(90);
  };

  const handleOk = () => {
    const cropper = cropperRef?.current?.cropper;
    if (typeof cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    handleCrop(cropper.getCroppedCanvas().toDataURL());
  };

  modal.handleOk(handleOk);

  return (
    <div className={`${p.prefixCls}-container-Cropper`}>
      <Cropper
        style={{ height: 420, width: 702 }}
        aspectRatio={aspectRatio}
        guides={false}
        src={url}
        ref={cropperRef}
        viewMode={1}
        dragMode="move"
        cropBoxMovable={false}
      // movable={false}
      />
      <div className="button-container">
        <Button icon="zoom_in" onClick={handleZoomIn} />
        <Button icon="zoom_out" onClick={handleZoomout} />
        <Button icon="play_90" onClick={handleRotate} />
        <Button>1:1</Button>
      </div>
    </div>

  );
};
const Index:React.FC<IProps> = (props:IProps) => {
  const {
    formDs,
    prefixCls,
    AppState,
    organizationId,
  } = props;
  const [imgType, setImgType] = useState('imageUrl');

  const handleDeleteImg = (type: string) => {
    formDs?.current?.set(type, null);
  };
  const handleImgTypeChange = (type:string) => {
    setImgType(type);
  };
  const handleCrop = async (url:any) => {
    function dataURLtoFile(dataurl: any, filename: string) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      // eslint-disable-next-line no-plusplus
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
    const qs = querystring.stringify({
      bucketName: 'iam-service',
    });
    const file = dataURLtoFile(url, `${new Date().getTime()}${AppState.getUserId}${imgType}`);
    const data = new FormData();
    data.append('file', file);
    const res = await axios.post(`/hfle/choerodon/v1/${organizationId ?? AppState?.currentMenuType?.organizationId}/cut_image?${qs}`, data);
    formDs?.current?.set(imgType, res);
  };
  const beforeUpload = (imgFile: any) => {
    const image = new Image();
    image.onload = function () {
      Modal.open({
        key: Modal.key(),
        title: '项目模板封面',
        children: <CropModal
          url={url}
          prefixCls={prefixCls}
          handleCrop={handleCrop}
          aspectRatio={220 / 80}
        />,
        style: {
          width: 750,
        },
      });
    };
    const url = URL.createObjectURL(imgFile);
    image.src = url;
    return false;
  };
  return (
    <div className="img-container img-container1">
      <img className="img-logo" src={formDs?.current?.get('imageUrl') ? formDs?.current?.get('imageUrl') : imageEmpty} alt="" />
      <>
        <div role="none" className="mask" onClick={() => { handleImgTypeChange('imageUrl'); }}>
          <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload}>
            <div className="imageload-div">
              <Icon type="photo_camera" />
            </div>
          </Upload>
          {/* {
          formDs?.current?.get('imageUrl') && <Icon onClick={() => { handleDeleteImg('imageUrl'); }} type="delete_forever" />
        } */}
        </div>
      </>
    </div>
  );
};
export default observer(Index);
