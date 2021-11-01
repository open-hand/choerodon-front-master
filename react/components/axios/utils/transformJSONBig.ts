import { AxiosResponse } from 'axios';
import JSONBig from 'json-bigint';

const JSONBigString = JSONBig({ storeAsString: true });

export default function transformJSONBig(data: AxiosResponse['data']) {
  try {
    return JSONBigString.parse(data);
  } catch (error) {
    return data;
  }
}
