import {ReqSocket} from "axon";
import {IKitaroMessage, KitaroError, KitaroErrorCodes, KitaroMessageType, logger} from "../utils";
export type AnyPromiseFunction = (...args: any[]) => Promise<any>;
interface IFunctionStore {
  [key: string]: AnyPromiseFunction;
}

export class RemoteKitaro {
  private ip: string;
  private port: number;
  private Sender: ReqSocket;
  private functions: IFunctionStore;

  constructor(ip: string, port: number) {
    this.ip = ip;
    this.port = port;
    this.Sender = new ReqSocket();
    this.functions = {};
  }

  public async connect() {
    try {
      this.Sender.connect(this.port, this.ip)
      return this.send({type: KitaroMessageType.KITARO_REGISTER});
    } catch (err) {throw new KitaroError(KitaroErrorCodes.connError,
      `Could not connect to Kitaro Microservice @${this.ip}:${this.port}`);
    }
  }

  public async close() {
    try {
      this.Sender.close();
    } catch(err) {
      throw new KitaroError(KitaroErrorCodes.connError ,"Could not close socket");
    }
    return this
  }

  private async handleRegisterResponse(data: any) {
    this.functions = data;
    logger.info(`Received function list from Kitaro Microservice @${this.ip}:${this.port}`);

    return data
  }

  private async handleFunctionResponse(data: any) {
    logger.info(data);
  }

  private send(payload: IKitaroMessage) {
    return new Promise((resolve, reject) => {
      this.Sender.send(payload, (resp: any) => {
        // handle based on type of message
        switch (payload.type) {
          case KitaroMessageType.KITARO_REGISTER:
            return resolve(this.handleRegisterResponse(resp));
          case KitaroMessageType.KITARO_USE_FUNCTION:
            return resolve(this.handleFunctionResponse(resp));
          default:
            return reject(new KitaroError(KitaroErrorCodes.unknownMessageType,
              `Unknown message type received from Kitaro Microservice @${this.ip}:${this.port}`));
        }
      });
    });
  }
}
