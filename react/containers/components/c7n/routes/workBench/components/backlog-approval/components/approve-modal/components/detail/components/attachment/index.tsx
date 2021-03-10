import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import SingleFileUplaod from '../SingleFileUpload';
import { DemandDetailStore } from '../../../../../../stores/DetailStore';

interface FileItem {
  uid: number,
  name: string,
  url: string,
  userId: string,
  percent?: number,
  status?: string
}
const Attachment: React.FC<{
  store: DemandDetailStore
}> = ({ store }) => {
  const { attachmentVOList } = store.demand;

  const [fileList, setFileList] = useState<FileItem[]>([]);

  useEffect(() => {
    const initialFileList: FileItem[] = (attachmentVOList || []).map((attachment) => ({
      uid: attachment.id,
      name: attachment.fileName,
      url: attachment.url,
      userId: attachment.createdBy,
    }));
    setFileList(initialFileList);
  }, [attachmentVOList]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {
        fileList && fileList.length > 0 && fileList.map((item) => (
          <SingleFileUplaod
            key={item.uid}
            url={item.url}
            fileName={item.name}
            hasDeletePermission={false}
            percent={!item.url && (item.percent || 0)}
            error={!item.url && item.status === 'error'}
          />
        ))
      }
    </div>
  );
};

export default observer(Attachment);
