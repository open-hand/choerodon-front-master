import MenuStore from '@/containers/stores/c7n/MenuStore';

export default function cursiveSetCorrectId(source: any[], correctId: any, flag: number) {
  let tempCorrectedId = correctId;
  let tempFlag = flag;
  for (let i = 0; i < source.length; i += 1) {
    if (source[i]?.code === MenuStore?.activeMenu?.code) {
      tempCorrectedId = source[i]?.id;
      tempFlag = 1;
    }
    if (source[i].subMenus && source[i].subMenus.length > 0) {
      tempCorrectedId = cursiveSetCorrectId(
        source[i].subMenus,
        tempCorrectedId,
        tempFlag,
      );
    }
    if (tempFlag === 1) {
      break;
    }
  }
  return tempCorrectedId;
}
