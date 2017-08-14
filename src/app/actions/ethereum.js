// @flow
import Web3 from 'web3'
import Web3Provider from '../lib/Web3Provider'
import BlockWatcher from '../lib/BlockWatcherProvider'
import {
    WEB3_INITIALIZED,
    WEB3_INITIALIZING,
    WEB3_INITIALIZATION_ERROR
} from '../constants/actions'
import type {Dispatch, GetState, ThunkAction} from "../types/types";

export type InitializingAction = {|
    +type: typeof WEB3_INITIALIZING
|}

export type InitializedAction = {|
    +type: typeof WEB3_INITIALIZED
|}

export type InitializationErrorAction = {|
    +type: typeof WEB3_INITIALIZATION_ERROR,
    +payload: string
|}

export type EthereumAction = InitializingAction | InitializedAction | InitializationErrorAction

function setInitializing(): InitializingAction {
    return {
        type: WEB3_INITIALIZING
    };
}

function setInitialized(): InitializedAction {
    return {
        type: WEB3_INITIALIZED
    };
}

function setInitializationFailed(err): InitializationErrorAction {
    return {
        type: WEB3_INITIALIZATION_ERROR,
        payload: err
    };
}

export function initialize(): ThunkAction {

    return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
        const ethereum = getState().ethereum;
        if (ethereum.initialized) {
            return Promise.reject(new Error("re-initialize ethereum no-op: already initialized"));
        }
        let w3 = new Web3();
        if (window && window.web3) {
            w3 = window.web3;
        } else {
            try {
                w3.setProvider(new w3.providers.HttpProvider("http://localhost:8545"));
            } catch (err) {
                dispatch(setInitializationFailed(err.message));
                return Promise.resolve();
            }
        }
        dispatch(setInitializing());
        w3.eth.getAccounts((err: Error, accounts: string[]) => {
            if (!err) {
                console.log(accounts);
                w3.eth.defaultAccount = accounts[0];
                Web3Provider.init(w3);
                BlockWatcher.init();
                dispatch(setInitialized());
                return Promise.resolve();
            } else {
                dispatch(setInitializationFailed(err.message));
                return Promise.resolve();
            }
        });
    };

}