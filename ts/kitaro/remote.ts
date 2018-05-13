import {ReqSocket} from "axon";
import {KitaroError, KitaroErrorCodes, logger, KitaroMessageType, KitaroMessage} from "../utils";
export type AnyPromiseFunction = (...args: any[]) => Promise<any>;
interface FunctionStore{
  [key: string]: AnyPromiseFunction
}


export class RemoteKitaro {
  private ip: string;
  private port: number;
  private Sender: ReqSocket;
  private functions: FunctionStore; 

  constructor(ip: string, port: number){
    this.ip = ip;
    this.port = port;
    this.Sender = new ReqSocket();
    this.functions = {};
  }

  async connect() {
    try {
      this.Sender.connect(this.port, this.ip, () => {
        // after connection get functions
        this.send({type: KitaroMessageType.KITARO_REGISTER})
      });
    } catch (err) {throw new KitaroError(KitaroErrorCodes.connError, 
      `Could not connect to Kitaro Microservice @${this.ip}:${this.port}`);
    }
  }

  async handleRegisterResponse(data: any) {
    this.functions = data
    logger.info(`Received function list from Kitaro Microservice @${this.ip}:${this.port}`)
    logger.info(this.functions)
  }

  async handleFunctionResponse(data: any) {
    logger.info(data)  
  }

  send(payload: KitaroMessage) {
    return new Promise((resolve, reject) => {
      this.Sender.send(payload.type, payload.fn, payload.params, (resp: any) => {
        // handle based on type of message
        switch (payload.type) {
          case KitaroMessageType.KITARO_REGISTER:
            return resolve(this.handleRegisterResponse(resp))
          case KitaroMessageType.KITARO_USE_FUNCTION:
            return resolve(this.handleFunctionResponse(resp))
          default:
            return reject(new KitaroError(KitaroErrorCodes.unknownMessageType, 
              `Unknown message type received from Kitaro Microservice @${this.ip}:${this.port}`));
        }
      })
    })
  }  
}
