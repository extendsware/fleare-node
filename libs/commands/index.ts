import ping from "./PING";
import status from "./STATUS";
import session from "./SESSION";
import get from "./GET";
import set from "./SET";
import exists from "./EXISTS";
import del from "./DELETE";
import strSet from "./STR_SET";
import strAppend from "./STR_APPEND";
import strRange from "./STR_RANGE";
import strGet from "./STR_GET";
import strLength from "./STR_LENGTH";
import ttlExpire from "./TTL_EXPIRE";
import ttl from "./TTL";
import numSet from "./NUM_SET";
import numGet from "./NUM_GET";
import numIncr from "./NUM_INCR";
import numDecr from "./NUM_DECR";
import listSet from "./LIST_SET";
import listPush from "./LIST_PUSH";
import listIset from "./LIST_ISET";
import listPop from "./LIST_POP";
import listGPop from "./LIST_GPOP";
import listGet from "./LIST_GET";
import listLen from "./LIST_LEN";
import listFind from "./LIST_FIND";
import jsonSet from "./JSON_SET";
import jsonAdd from "./JSON_ADD";
import jsonMerge from "./JSON_MERGE";
import jsonSetRef from "./JSON_SETREF";
import jsonGet from "./JSON_GET";
import mapSet from "./MAP_SET";
import mapCSet from "./MAP_CSET";
import mapDel from "./MAP_DEL";
import mapGet from "./MAP_GET";

export const commands = {
  ping,
  status,
  session,
  get,
  set,
  exists,
  del,
  strSet,
  strAppend,
  strRange,
  strGet,
  strLength,
  ttlExpire,
  ttl,
  numSet,
  numGet,
  numIncr,
  numDecr,
  listSet,
  listPush,
  listIset,
  listPop,
  listGet,
  listLen,
  listGPop,
  listFind,
  jsonSet,
  jsonAdd,
  jsonMerge,
  jsonSetRef,
  jsonGet,
  mapSet,
  mapCSet,
  mapDel,
  mapGet
};

export type CommandMap = typeof commands;
