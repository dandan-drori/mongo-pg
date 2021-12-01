import {Id} from "./global";

export interface Flight<I = Id, S = string, N = number> {
    _id?: I;
    departure: S;
    arrival: S;
    eta: S;
    distance: N;
}

export interface FlightProjection {
    projection: Partial<Flight<number, number>>;
}

export type FlightQuery = Record<string, Partial<Flight>>;
