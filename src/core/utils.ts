import _ from "lodash";
import { Dispatch } from "redux";
import { RouteProp, ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
const moment = require("moment");

export const encodeURLFromJson = (params: object) => {
  var q: string[] = [];
  for (let key in params) {
    const value = params[key];
    if (value !== null && value !== undefined) {
      let encoded = encodeURIComponent(key) + "=" + encodeURIComponent(value);
      q.push(encoded);
    }
  }
  return q.join("&");
};

export const D_F = "YYYY-MM-DDTHH:mm:ss.SSSZZ";

export function formatBytes(bytes, decimals) {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function compareDate(date_a: string, date_b: string, utcOffset: number) {
  let d1 = moment
    .parseZone(date_a)
    .utcOffset(utcOffset)
    .startOf("day");
  let d2 = moment
    .parseZone(date_b)
    .utcOffset(utcOffset)
    .startOf("day");

  return d1.isSame(d2);
}

export function matchAny<Type>(array: Type[], target: Type) {
  return array.reduce((memo, current) => memo || current == target, false);
}

export function insertOrdered<Type>(
  array: Type[],
  item: Type,
  indetity: (a: Type) => any
) {
  const indexToInsert = _.sortedIndexBy(array, item, indetity);
  array.splice(indexToInsert, 0, item);
  return array;
}

export function firstLetterUp(val: string) {
  return val[0].toUpperCase() + val.slice(1);
}

export type DispatchProps = {
  dispatch: Dispatch;
};

export type StackScreenTmpProps<
  ParamsList extends ParamListBase,
  Name extends keyof ParamsList
> = {
  route: RouteProp<ParamsList, Name>;
  navigation: StackNavigationProp<ParamsList, Name>;
};

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type Diff<T, K> = Omit<T, keyof K>;

export enum CRUDState {
  idle = "idle",
  loading = "loading",
  loading_more = "loading_more",
  creating = "creating",
  updating = "updating",
  deleting = "deleting",
}
