import {ReqSocket} from "axon";
import {IKitaroMessage, KitaroError, KitaroErrorCodes, KitaroMessageType, logger} from "../utils";
import { IKitaroReply, KitaroFunctions } from "../utils/kitaro_message";
export type AnyPromiseFunction = (...args: any[]) => Promise<any>;
interface IFunctionStore {
  [key: string]: AnyPromiseFunction;
}

export class RemoteKitaro {
  private ip: string;
  private port: number;
  private Sender: ReqSocket;
  private functions: KitaroFunctions;
  private exec: IFunctionStore;

  constructor(ip: string, port: number) {
    this.ip = ip;
    this.port = port;
    this.Sender = new ReqSocket();
    this.functions = [];
    this.exec = {};
  }

  public connect = async () => {
    try {
      this.Sender.connect(this.port, this.ip);
      return this.send({type: KitaroMessageType.KITARO_REGISTER});
    } catch (err) {throw new KitaroError(KitaroErrorCodes.connError,
      `Could not connect to Kitaro Microservice @${this.ip}:${this.port}`);
    }
  }

  public close = async () => {
    try {
      this.Sender.close();
    } catch (err) {
      throw new KitaroError(KitaroErrorCodes.connError, "Could not close socket");
    }
    return this;
  }

  private handleRegisterResponse = async (data: KitaroFunctions) => {
    this.functions = data;
    logger.info(`Received function list from Kitaro Microservice @${this.ip}:${this.port}`);

    // for each of the functions add wrapper to execute
    // check if this can result in prototype injection
    this.functions.forEach(f => {
      this.exec[f.label] = (...args) => this.send({
        fn: f.label,
        params: args,
        type: KitaroMessageType.KITARO_USE_FUNCTION,
      });
    });
    return data;
  }

  // for now just return the response
  // TODO: keep usage statistics, offer option for analysis of performance
  private handleFunctionResponse = async (data: IKitaroReply): Promise<IKitaroReply> => data;

  private send = (payload: IKitaroMessage) => new Promise((resolve, reject) => {
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
  })
}
