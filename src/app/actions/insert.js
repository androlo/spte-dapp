// @flow
import PatriciaTrieContractProvider from '../lib/PatriciaTrieContractProvider'
import StringNotZeroValidator from '../validators/StringNotEmptyValidator'
import {updateTrie} from './trie'
import {FIELD_EMPTY_ERROR} from '../constants/errors'
import {
    INSERT_INSERTING,
    INSERT_INSERT_DONE,
    INSERT_INSERTION_ERROR,
    INSERT_KEY,
    INSERT_KEY_ERROR,
    INSERT_VALUE,
    INSERT_VALUE_ERROR
} from '../constants/actions'
import type {Dispatch, GetState, ThunkAction} from "../types/types";
import type {Bytes32} from "../../web3/types";
import Web3Provider from "../lib/Web3Provider";

export type InsertingAction = {|
    +type: typeof INSERT_INSERTING
|}

export type InsertDoneAction = {|
    +type: typeof INSERT_INSERT_DONE
|}

export type InsertionErrorAction = {|
    +type: typeof INSERT_INSERT_DONE,
    +payload: string
|}

export type InsertKeyAction = {|
    +type: typeof INSERT_INSERT_DONE,
    +payload: string
|}

export type InsertKeyErrorAction = {|
    +type: typeof INSERT_INSERT_DONE,
    +payload: string
|}

export type InsertValueAction = {|
    +type: typeof INSERT_INSERT_DONE,
    +payload: string
|}

export type InsertValueErrorAction = {|
    +type: typeof INSERT_INSERT_DONE,
    +payload: string
|}

export type InsertAction =
    InsertingAction |
    InsertDoneAction |
    InsertionErrorAction |
    InsertKeyAction |
    InsertKeyErrorAction |
    InsertValueAction |
    InsertValueErrorAction

function setInserting(): InsertingAction {
    return {
        type: INSERT_INSERTING
    }
}

function setInsertDone(key: string, keyHash: Bytes32, value: string, valueHash: Bytes32): InsertDoneAction {
    return {
        type: INSERT_INSERT_DONE,
        payload: {key, keyHash, value, valueHash}
    };
}

function setInsertionError(err: string): InsertionErrorAction {
    return {
        type: INSERT_INSERTION_ERROR,
        payload: err
    };
}

function setKey(key: string): InsertKeyAction {
    return {
        type: INSERT_KEY,
        payload: key
    }
}

function setKeyError(err: string): InsertKeyErrorAction {
    return {
        type: INSERT_KEY_ERROR,
        payload: err
    }
}

function setValue(value: string): InsertValueAction {
    return {
        type: INSERT_VALUE,
        payload: value
    }
}

function setValueError(err: string): InsertValueErrorAction {
    return {
        type: INSERT_VALUE_ERROR,
        payload: err
    }
}

export function setKeyField(key: string): ThunkAction {
    return (dispatch: Dispatch, getState: GetState): void => {
        if (StringNotZeroValidator.validate(key)) {
            dispatch(setKey(key));
        } else {
            dispatch(setKeyError(FIELD_EMPTY_ERROR))
        }
    };
}

export function setValueField(value: string) {
    return (dispatch: Dispatch, getState: GetState): void => {
        if (StringNotZeroValidator.validate(value)) {
            dispatch(setValue(value));
        } else {
            dispatch(setValueError(FIELD_EMPTY_ERROR))
        }
    };
}

export function insert(): ThunkAction {
    return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
        const trie = getState().trie;
        const insert_ = getState().insert;
        const deploy = getState().deploy;
        if (insert_.inserting) {
            return Promise.reject(new Error("insert no-op: insert in process"));
        }
        if (insert_.keyError) {
            return Promise.reject(new Error("insert no-op: key error"));
        }
        if (insert_.valueError) {
            return Promise.reject(new Error("insert no-op: value error"));
        }
        if (trie.updating) {
            return Promise.reject(new Error("insert no-op: update in process"));
        }
        if (!deploy.contractAddress) {
            return Promise.reject(new Error("insert no-op: no contract deployed"));
        }
        dispatch(setInserting());
        const key = insert_.key;
        const value = insert_.value;

        try {
            await PatriciaTrieContractProvider.patriciaTrieContract().insert(key, value);
            const web3 = Web3Provider.web3();
            const keyHash = web3.sha3(key);
            const valueHash = web3.sha3(value);
            dispatch(setInsertDone(key, keyHash, value, valueHash));
            dispatch(updateTrie());
        } catch (err) {
            dispatch(setInsertionError(err.message))
        }
        return Promise.resolve();
    };
}