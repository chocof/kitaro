import {RepSocket} from "axon";
import {KitaroError, KitaroErrorCodes, logger} from "../utils";
import {IKitaroMessage, KitaroMessageType} from "../utils";

export type AnyPromiseFunction = (...args: any[]) => Promise<any>;
export interface IDocType {
  usage: string;
  params: Array<{[key: string]: string}>;
  errors: Array<{[key: string]: string}>;
  notes: Array<{[key: string]: string}>;
  returns: string;
}

export interface IFunctionStore {
  [key: string]: {
    fn: AnyPromiseFunction;
    doc: IDocType;
  };
}

export class Kitaro {
  private name: string;
  private port: number | string;
  private myFunctions: IFunctionStore;
  private Receiver: RepSocket;

  constructor(name: string, port: number) {
    this.name = name;
    this.port = port;

    this.myFunctions = {};
    this.Receiver = new RepSocket();
  }

  public async listen() {
      if (!this.port) {
        throw new KitaroError(KitaroErrorCodes.portMissing, "A port must be provided");
      }
      try {
        this.Receiver.bind(this.port);
        this.Receiver.on("message", this.handleMessage);
      } catch (err) {
        throw new KitaroError(KitaroErrorCodes.connError, "Could not bind socket: " + err);
      }
      return this;
  }

  public addFunction(label: string, fn: AnyPromiseFunction, doc: IDocType): boolean {
    if (label in this.myFunctions) {
      throw new KitaroError(KitaroErrorCodes.functionExists, "This function already exists");
    }
    logger.debug(`Added new function "${label}".`);
    this.myFunctions[label] = { fn, doc };
    return true;
  }

  public removeFunction(label: string): boolean {
    try {
      delete this.myFunctions[label];
    } catch {
      throw new KitaroError(KitaroErrorCodes.functionMissing, "This function does not exist");
    }
    logger.debug(`Removed function "${label}" from function store!`);
    return true;
  }

  public toString() {
    return ` Kitaro Module : ${this.name}`;
  }

  public async close() {
    try {
      this.Receiver.close();
    } catch(err) {
      throw new KitaroError(KitaroErrorCodes.connError ,"Could not close socket");
    }
    return this
  }

  private async handleKitaroRegister() {
    return Object.keys(this.myFunctions).map((k) => ({
      label: k,
      returns: typeof this.myFunctions[k].fn,
    }));
  }

  private async handleUseFunction(payload: IKitaroMessage) {
    logger.info(JSON.stringify(payload));
  }

  private handleMessage = async (message: IKitaroMessage, reply: (rep: any) => void) => {
    logger.info(JSON.stringify(message))
    switch (message.type) {
      case KitaroMessageType.KITARO_REGISTER:
        reply(await this.handleKitaroRegister());
        break;
      case KitaroMessageType.KITARO_USE_FUNCTION:
        reply(await this.handleUseFunction(message));
        break;
      default:
        throw new KitaroError(KitaroErrorCodes.unknownMessageType,
          `Unknown message:${message.type} type received from another Kitaro Microservice`);
    }
  }
}
