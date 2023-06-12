import FileSaver from 'file-saver';
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
  /**
   * 后端文件服务地址前缀
   */
  decryptionPrefix: string
}

const getShouldDecryption = ({ url, decryptionPrefix }: { url: string, decryptionPrefix: string }) => !!(decryptionPrefix && url && url.startsWith(decryptionPrefix));

const getFileUrl = ({
  url, bucketName = BUCKET_NAME_PRIVATE, shouldEncode = false, decryptionPrefix,
}: Pick<IDownloadFileRedirectProps, 'url' | 'bucketName' | 'decryptionPrefix'> & { shouldEncode?: boolean }) => {
  if (!getShouldDecryption({ url, decryptionPrefix })) {
    return url;
  }
  const accessToken = getCookieToken();
  const newUrl = `${getEnv('API_HOST')}/hfle/v1/files/redirect-url?bucketName=${bucketName || BUCKET_NAME_PRIVATE}&access_token=${accessToken}&url=${encodeURIComponent(url)}`;

  return shouldEncode ? encodeURIComponent(newUrl) : newUrl;
};

const downloadFileRedirect = ({
  url, fileName, bucketName, callbackFunc, decryptionPrefix,
}: IDownloadFileRedirectProps) => {
  const shouldDecryption = getShouldDecryption({ url, decryptionPrefix });
  const newUrl = getFileUrl({ url, bucketName, decryptionPrefix });
  if (shouldDecryption || callbackFunc) {
    downloadFile(newUrl, fileName, callbackFunc);
  } else {
    FileSaver.saveAs(newUrl, fileName);
  }
};

export { getFileUrl, downloadFileRedirect };
