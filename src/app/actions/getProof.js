// @flow
import PatriciaTrieContractProvider from '../lib/PatriciaTrieContractProvider'
import StringNotZeroValidator from '../validators/StringNotEmptyValidator'
import {FIELD_EMPTY_ERROR} from '../constants/errors'
import {
    GET_PROOF_GETTING,
    GET_PROOF_GET,
    GET_PROOF_GET_ERROR,
    GET_PROOF_KEY,
    GET_PROOF_KEY_ERROR,
    GET_PROOF_VALUE
} from '../constants/actions'

import type {Proof} from "../lib/PatriciaTrieContractProvider"
import type {Dispatch, GetState, ThunkAction} from "../types/types"
import type {Valid} from "../reducers/getProof";

type GetData = {
    proof: Proof,
    valid: Valid
}

export type ProofGetAction = {|
    +type: typeof GET_PROOF_GET,
    +payload: GetData
|}

export type ProofGettingAction = {|
    +type: typeof GET_PROOF_GETTING
|}

export type ProofGetErrorAction = {|
    +type: typeof GET_PROOF_GET_ERROR,
    +payload: string
|}

export type ProofKeyAction = {|
    +type: typeof GET_PROOF_KEY,
    +payload: string
|}

export type ProofKeyErrorAction = {|
    +type: typeof GET_PROOF_KEY_ERROR,
    +payload: string
|}

export type ProofValueAction = {|
    +type: typeof GET_PROOF_VALUE,
    +payload: string
|}

export type GetProofAction =
    ProofGetAction |
    ProofGettingAction |
    ProofGetErrorAction |
    ProofKeyAction |
    ProofKeyErrorAction |
    ProofValueAction

function setGetting(): ProofGettingAction {
    return {
        type: GET_PROOF_GETTING
    }
}

function setGettingDone(proof: Proof, valid: Valid): ProofGetAction {
    return {
        type: GET_PROOF_GET,
        payload: {proof: proof, valid: valid}
    };
}

function setGetError(err: string): ProofGetErrorAction {
    return {
        type: GET_PROOF_GET_ERROR,
        payload: err
    };
}

function setKey(key: string): ProofKeyAction {
    return {
        type: GET_PROOF_KEY,
        payload: key
    }
}

function setKeyError(err: string): ProofKeyErrorAction {
    return {
        type: GET_PROOF_KEY_ERROR,
        payload: err
    }
}

function setValue(value: string): ProofValueAction {
    return {
        type: GET_PROOF_VALUE,
        payload: value
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

export function setValueField(value: string): ThunkAction {
    return (dispatch: Dispatch, getState: GetState): void => {
        dispatch(setValue(value));
    };
}

export function getProof(): ThunkAction {

    return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
        const trie = getState().trie;
        const currentTrie = trie.currentTrie;
        if (!currentTrie) {
            return Promise.reject(new Error("get proof no-op: no current trie in place"));
        }
        const proof = getState().getProof;
        const deploy = getState().deploy;
        if (proof.getting) {
            return Promise.reject(new Error("get proof no-op: getting in process"));
        }
        if (proof.keyError) {
            return Promise.reject(new Error("get proof no-op: key error"));
        }
        if (trie.updating) {
            return Promise.reject(new Error("get proof no-op: trie update in process"));
        }
        if (!deploy.contractAddress) {
            return Promise.reject(new Error("get proof no-op: no contract deployed"));
        }
        dispatch(setGetting());
        const key = proof.key;
        try {
            const ptc = PatriciaTrieContractProvider.patriciaTrieContract();
            const result = await ptc.getProof(key);
            const value = proof.value;
            let valid = "";
            if (!!value) {
                const rootHash = currentTrie.rootHash;
                try {
                    valid = await ptc.verifyProof(rootHash, key, value, result.branchMask, result.siblings) ? "yes" : "no";
                } catch (err) {
                    valid = "no";
                }
            }
            dispatch(setGettingDone(result, valid));
        } catch (err) {
            dispatch(setGetError(err.message));
        }
        return Promise.resolve();
    };
}