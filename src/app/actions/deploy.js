// @flow
import PatriciaTrieContractProvider from '../lib/PatriciaTrieContractProvider'
import {
    CONTRACT_DEPLOYED,
    CONTRACT_DEPLOYING,
    CONTRACT_DEPLOYMENT_ERROR
} from '../constants/actions'

import type {Dispatch, GetState, ThunkAction} from "../types/types";

export type DeployingAction = {|
    +type: typeof CONTRACT_DEPLOYING
|}

export type DeployedAction = {|
    +type: typeof CONTRACT_DEPLOYED,
    +payload: string
|}

export type DeploymentErrorAction = {|
    +type: typeof CONTRACT_DEPLOYMENT_ERROR,
    +payload: string
|}

export type DeployAction = DeployingAction | DeployedAction | DeploymentErrorAction

function setContractDeploying(): DeployingAction {
    return {
        type: CONTRACT_DEPLOYING
    }
}

function setContractDeployed(address: string): DeployedAction {
    return {
        type: CONTRACT_DEPLOYED,
        payload: address
    };
}

function setContractDeploymentError(err: string): DeploymentErrorAction {
    return {
        type: CONTRACT_DEPLOYMENT_ERROR,
        payload: err
    };
}

export function deploy(): ThunkAction {

    return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
        const ethereum = getState().ethereum;
        const trie = getState().trie;
        const deploy = getState().deploy;
        if (!ethereum.initialized) {
            return Promise.reject(new Error("deploying contract no-op: ethereum not initialized"));
        }
        if (trie.updating) {
            return Promise.reject(Error("deploying contract no-op: trie update in process"));
        }
        if (deploy.deploying) {
            return Promise.reject(Error("deploying contract no-op: already deploying"));
        }
        dispatch(setContractDeploying());
        try {
            await PatriciaTrieContractProvider.deployNew();
            dispatch(setContractDeployed(PatriciaTrieContractProvider.patriciaTrieContract().address()));
        } catch (err) {
            dispatch(setContractDeploymentError(err.message))
        }
        return Promise.resolve();
    };
}