// @flow
import {
    KECCAK_256_GET,
    KECCAK_256_INPUT
} from '../constants/actions'

import type {State, Action} from '../types/types'
import type {Bytes} from "../../web3/types";

export type Keccak256 = {
    hash: Bytes,
    hashInput: string | Bytes,
    input: string | Bytes
}

const initialState: Keccak256 = {
    hash: "",
    hashInput: "",
    input: ""
};

export const getKeccak256 = (state: State): Keccak256 => state.keccak256;

export default (state: Keccak256 = initialState, action: Action) => {
    switch (action.type) {
        case KECCAK_256_GET:
            return {hash: action.payload, hashInput: state.input, input: state.input};
        case KECCAK_256_INPUT:
            return {...state, input: action.payload};
        default:
            return state;
    }
};