import getEnv from '@/utils/getEnv';
import { getCookieToken } from '@/utils/accessToken';
import { downloadFile } from '@/functions';
import { BUCKET_NAME_PRIVATE } from '@/constants';

interface IDownloadFileRedirectProps {
  url: string
  fileName?: string
  /**
   * 文件存储的桶
   * @default 'private'
   */
  bucketName?: string
  /**
   * 下载回调
   */
  callbackFunc?: Function
}

const getFileUrl = ({ url, bucketName = BUCKET_NAME_PRIVATE, shouldEncode = false }: Pick<IDownloadFileRedirectProps, 'url' | 'bucketName'> & { shouldEncode?: boolean }) => {
  const accessToken = getCookieToken();
  const newUrl = `${getEnv('API_HOST')}/hfle/v1/files/redirect-url?bucketName=${bucketName || BUCKET_NAME_PRIVATE}&access_token=${accessToken}&url=${encodeURIComponent(url)}`;

  return shouldEncode ? encodeURIComponent(newUrl) : newUrl;
};

const downloadFileRedirect = ({
  url, fileName, bucketName, callbackFunc,
}: IDownloadFileRedirectProps) => {
  const newUrl = getFileUrl({ url, bucketName });
  downloadFile(newUrl, fileName, callbackFunc);
};

export { getFileUrl, downloadFileRedirect };
