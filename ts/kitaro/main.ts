import {RepSocket} from "axon";
import {logger, KitaroError, KitaroErrorCodes} from "../utils";
import {KitaroMessage, KitaroMessageType} from "../utils";

export type AnyPromiseFunction = (...args: any[]) => Promise<any>;
export interface DocType {
  usage: string,
  params: Array<{[key: string]: string}>,
  errors: Array<{[key: string]: string}>,
  notes: Array<{[key: string]: string}>,
  returns: string
}

export interface FunctionStore {
  [key: string]: {
    fn: AnyPromiseFunction,
    doc: DocType
  }
}

export class Kitaro{
  private name: string;
  private port: number | undefined;
  private myFunctions: FunctionStore;
  private Receiver: RepSocket;

  constructor(name: string, port?: number){
    this.name = name;
    if (port){
      this.port = port;
    }
    this.myFunctions = {};
    this.Receiver = new RepSocket();
  }

  async listen(port?: number){
    if (port) {
      this.port = port
    } else if (!this.port) {
      throw new KitaroError(KitaroErrorCodes.portMissing, "A port must be provided");
    }
    try {
      await this.Receiver.bind(this.port, () => {
        logger.info(`Kitaro Microservice is listening on port ${this.port}`)
        this.Receiver.on('message', this.handleMessage)
      })
    } catch (err){
      throw new KitaroError(KitaroErrorCodes.connError, "Could not bind socket: " + err);
    }
  }

  addFunction(label: string, fn: AnyPromiseFunction, fnDoc: DocType): boolean{
    if (label in this.myFunctions){ 
      throw new KitaroError(KitaroErrorCodes.functionExists, "This function already exists");
    }
    logger.debug(`Added new function "${label}".`)
    this.myFunctions[label] = {
      fn: fn,
      doc: fnDoc
    };
    return true;
  }

  removeFunction(label: string): boolean{
    try{
      delete this.myFunctions[label];
    }catch{
      throw new KitaroError(KitaroErrorCodes.functionMissing, "This function does not exist");
    }
    logger.debug(`Removed function "${label}" from function store!`)
    return true;
  }

  toString() {
    return ` Kitaro Module : ${this.name}`;
  }

  async handleRegister() {
    return Object.keys(this.myFunctions).map(k => ({
      label: k,
      returns: typeof this.myFunctions[k].fn
    }))
  }

  async handleUseFunction(payload: KitaroMessage) {
    logger.info(payload)
  }

  async handleMessage(message: KitaroMessage, reply: (rep: any) => void){
    switch (message.type) {
      case KitaroMessageType.KITARO_REGISTER:
        reply(await this.handleRegister());
      break
      case KitaroMessageType.KITARO_USE_FUNCTION:
       reply(await this.handleUseFunction(message));
      break
      default:
        throw new KitaroError(KitaroErrorCodes.unknownMessageType, 
          `Unknown message type received from another Kitaro Microservice`);
    }
  }
}