import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import toString from 'lodash/toString';
import isNil from 'lodash/isNil';

function getError(option:any, xhr:any) {
  const msg = `cannot post ${option.action} ${xhr.status}'`;
  const err:any = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = option.action;
  return err;
}

function getBody(xhr:any) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

function requestFileFormData(requestFileKeys:any, option:any) {
  const formData = new FormData();
  /**
   * 添加注入的data数据
   */
  if (option.data) {
    Object.keys(option.data).map((key) => {
      formData.append(key, option.data[key]);
    });
  }
  /**
   * 添加文件数据
   */
  formData.append(option.filename, option.file);

  const toStringValue = (value:any) => {
    if (isNil(value)) {
      return '';
    }
    if (isString(value)) {
      return value;
    }
    if (isObject(value)) {
      return JSON.stringify(value);
    }
    return toString(value);
  };

  /**
   *
   * @param {所有数据} obj
   * @param {需要传出的参数keys} arrayString
   */
  const ArrayToObject = (obj:any, arrayString:any) => {
    arrayString.forEach((item:any) => {
      formData.append(toStringValue(item), toStringValue(obj[toStringValue(item)]));
    });
  };

  /**
   * 判断是否需要增加key
   */
  if (isString(requestFileKeys) || isArray(requestFileKeys)) {
    let requestFileKeysFile = ['uid', 'type', 'name', 'lastModifiedDate'];
    if (isString(requestFileKeys)) {
      requestFileKeysFile.push(requestFileKeys);
    } else {
      requestFileKeysFile = [...requestFileKeysFile, ...requestFileKeys];
    }
    ArrayToObject(option.file, requestFileKeysFile);
  }
  return formData;
}
export default function upload(option:any, newFileToStore:CallableFunction) {
  const xhr = new XMLHttpRequest();

  const tempOpts = option;

  tempOpts.file.xhr = xhr;

  newFileToStore(tempOpts.file);

  if (tempOpts.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        // @ts-expect-error
        e.percent = e.loaded / e.total * 100;
      }
      tempOpts.onProgress(e);
    };
  }

  const formData = requestFileFormData(tempOpts.requestFileKeys, tempOpts);

  xhr.onerror = function error(e) {
    tempOpts.file.status = 'error';
    tempOpts.onError(e);
  };

  // eslint-disable-next-line consistent-return
  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return tempOpts.onError(getError(tempOpts, xhr), getBody(xhr));
    }
    tempOpts.file.status = 'success';
    tempOpts.onSuccess(getBody(xhr));
  };

  xhr.open('post', tempOpts.action, true);

  if (tempOpts.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = tempOpts.headers || {};

  if (headers['X-Requested-With'] !== null) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }

  for (const h in headers) {
    // eslint-disable-next-line no-prototype-builtins
    if (headers.hasOwnProperty(h) && headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h]);
    }
  }
  xhr.send(formData);

  return {
    abort() {
      xhr.abort();
    },
  };
}
