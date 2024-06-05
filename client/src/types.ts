import { Listener } from "@lenra/client";
import {
    AdaptableType,
    BaseListener,
    CommonAdherentListView,
    CommonClubListView,
    CommonPraticienListView
} from "common-types";

type AdaptedType<T> = {
    [Key in keyof T]:
    T[Key] extends BaseListener<infer U>
    ? Listener<U>
    : T[Key] extends AdaptableType<infer U>
    ? AdaptedType<U>
    : T[Key];
}

export type PraticienListView = AdaptedType<CommonPraticienListView>;
export type ClubListView = AdaptedType<CommonClubListView>;
export type AdherentListView = AdaptedType<CommonAdherentListView>;
