export enum KitaroErrorCodes {
  functionExists,
  functionMissing,
  portMissing,
  connError,
  unknownMessageType,
}

export class KitaroError extends Error {
    constructor(public status: KitaroErrorCodes, public message: string) {
        super();

        Object.setPrototypeOf(this, KitaroError.prototype);
    }
}
