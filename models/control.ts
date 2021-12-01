import {Id} from "./global";

export interface Control<I = Id, S = string> {
    _id?: I;
    name: S;
    flights: I[];
}