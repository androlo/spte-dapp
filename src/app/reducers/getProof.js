// @flow
import {
    GET_PROOF_GETTING,
    GET_PROOF_GET,
    GET_PROOF_GET_ERROR,
    GET_PROOF_KEY,
    GET_PROOF_KEY_ERROR,
    GET_PROOF_VALUE
} from '../constants/actions'

import {FIELD_EMPTY_ERROR} from '../constants/errors'

import type {State, Action} from '../types/types'
import type {Proof} from "../lib/PatriciaTrieContractProvider";

export type Valid = "" | "yes" | "no"

export type GetProof = {
    getting: boolean,
    proof: ?Proof,
    valid: Valid,
    getError: string,
    key: string,
    keyError: string,
    value: string
}

const initialState: GetProof = {
    getting: false,
    proof: null,
    valid: "",
    getError: "",
    key: "",
    keyError: FIELD_EMPTY_ERROR,
    value: ""
};

export const getGetProof = (state: State): GetProof => state.getProof;

export default (state: GetProof = initialState, action: Action): GetProof => {
    switch (action.type) {
        case GET_PROOF_GETTING:
            return {...state, getting: true, getError: "", proof: null};
        case GET_PROOF_GET:
            return {...state, getting: false, getError: "", proof: action.payload.proof, valid: action.payload.valid};
        case GET_PROOF_GET_ERROR:
            return {...state, getting: false, getError: action.payload, proof: null};
        case GET_PROOF_KEY:
            return {...state, key: action.payload, keyError: ""};
        case GET_PROOF_KEY_ERROR:
            return {...state, key: "", keyError: action.payload};
        case GET_PROOF_VALUE:
            return {...state, value: action.payload};
        default:
            return state;
    }
};