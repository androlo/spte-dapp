// @flow
import {
    WEB3_INITIALIZED,
    WEB3_INITIALIZING,
    WEB3_INITIALIZATION_ERROR
} from '../constants/actions'

import type {State, Action} from '../types/types'

export type Ethereum = {
    +initialized: boolean,
    +initializing: boolean,
    +initializationError: string
}

const initialState: Ethereum = {
    initialized: false,
    initializing: false,
    initializationError: ""
};

export const getEthereum = (state: State): Ethereum => state.ethereum;

export default (state: Ethereum = initialState, action: Action) => {
    switch (action.type) {
        case WEB3_INITIALIZING:
            return {...initialState, initializing: true};
        case WEB3_INITIALIZED:
            return {...initialState, initialized: true};
        case WEB3_INITIALIZATION_ERROR:
            if (action.payload) {
                return {...initialState, initializationError: action.payload};
            }
            throw new Error("Type error in action");
        default:
            return state;
    }
};