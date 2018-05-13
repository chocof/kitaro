export enum KitaroMessageType {
  KITARO_REGISTER,
  KITARO_USE_FUNCTION
}

export interface KitaroMessage {
  type: KitaroMessageType,
  fn?: string,
  params?: Array<{[key:string]: any}>
}

export interface KitaroReply {
  type: KitaroMessageType,
  fn?: string,
  params?: Array<{[key:string]: any}>
}

