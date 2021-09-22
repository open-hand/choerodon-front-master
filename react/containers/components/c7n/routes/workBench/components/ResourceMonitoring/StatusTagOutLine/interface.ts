export type statusKinds = 'success' | 'operating' | 'failed' | 'default' | 'occupied' | 'connected' | 'disconnect' | 'processing';

export type statusObj = {
  text: string,
  hoverText: string,
  bgColor: string,
  fontColor: string,
}

export type statusKindsMap = Record<statusKinds, statusObj>

export interface StatusTagOutLineProps {
  status: statusKinds,
  type?: string,
}
