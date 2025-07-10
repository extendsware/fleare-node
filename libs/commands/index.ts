import ping from "./PING";
import status from "./STATUS";
import session from "./SESSION";
import get from "./GET";
import set from "./SET";
import exists from "./EXISTS";

export const commands = {
  ping,
  status,
  session,
  get,
  set,
  exists,
};

export type CommandMap = typeof commands;
