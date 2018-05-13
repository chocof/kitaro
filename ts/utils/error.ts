export class BaseError {
    constructor () {
        Error.apply(this, arguments);
    }
}
BaseError.prototype = new Error();

export enum KitaroErrorCodes{
  functionExists,
  functionMissing,
  portMissing,
  connError,
  unknownMessageType
}

export class KitaroError extends BaseError {
    constructor (public status: KitaroErrorCodes, public message: string) {
        super();    
    }
}
