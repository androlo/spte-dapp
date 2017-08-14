// @flow
import {
    KECCAK_256_GET,
    KECCAK_256_INPUT
} from '../constants/actions'

import type {Dispatch, GetState, ThunkAction} from "../types/types";
import Web3Provider from "../lib/Web3Provider";

export type Keccak256GetAction = {|
    +type: typeof KECCAK_256_GET,
    +payload: string
|}

export type Keccak256InputAction = {|
    +type: typeof KECCAK_256_INPUT,
    +payload: string
|}

export type Keccak256Action =
    Keccak256GetAction |
    Keccak256InputAction

function setGettingDone(hash: string): Keccak256GetAction {
    return {
        type: KECCAK_256_GET,
        payload: hash
    };
}

function setInput(input: string): Keccak256InputAction {
    return {
        type: KECCAK_256_INPUT,
        payload: input
    }
}

export function setInputField(input: string): ThunkAction {
    return (dispatch: Dispatch, getState: GetState): void => {
        dispatch(setInput(input));
    };
}

export function getHash(): ThunkAction {
    return (dispatch: Dispatch, getState: GetState): void => {
        const str = getState().keccak256.input;
        const web3 = Web3Provider.web3();
        if (str.length >= 2 && str.substr(0, 2) === '0x') {
            dispatch(setGettingDone(web3.sha3(str, {encoding: 'hex'})));
        } else {
            dispatch(setGettingDone(web3.sha3(str)));
        }
    };
}