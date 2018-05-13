export enum KitaroMessageType {
  KITARO_REGISTER,
  KITARO_USE_FUNCTION,
}

export interface IKitaroMessage {
  type: KitaroMessageType;
  fn?: string;
  params?: Array< {[key: string]: any} >;
}

export interface IKitaroReply {
  type: KitaroMessageType;
  fn?: string;
  params?: Array< {[key: string]: any} >;
}
