export enum KitaroMessageType {
  KITARO_REGISTER,
  KITARO_USE_FUNCTION,
  KITARO_ERROR,
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
  error?: string;
}

export type  KitaroFunctions = Array< {
  label: string;
  returns: string;
} >;
