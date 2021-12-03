import { COMMON_ZH_CN_KEYS } from '@/locale/zh_CN/common';
import useFormatMessage from '../useFormatMessage';

// 公用的多语言触发hook
// 到时候是需要改掉的，各个服务之间需要拆离公共多语言冲突的配置
// 改完之后这个hook就可以废弃了，统一用useFormatMessage
const useFormatCommon = () => useFormatMessage<unknown, unknown, COMMON_ZH_CN_KEYS>();

export default useFormatCommon;
