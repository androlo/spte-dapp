// @flow
import {
    INSERT_INSERT_DONE,
    CONTRACT_DEPLOYED,
    KNVS_SET_TABLE_VIEW
} from '../constants/actions'

import type {State, Action} from '../types/types'
import type {Bytes32} from "../../web3/types";

export type TableView = 'bin' | 'hex'

export type TrieMap = {|
    +keysToHashes: Map<string, Bytes32>,
    +hashesToValues: Map<Bytes32, string>,
    +keysToValues: Map<string, string>
|}

export type KeysAndValues = {
    trieMap: TrieMap,
    tableView: TableView,
    expanded: boolean
}

const initialState: KeysAndValues = {
    trieMap: createTrieMap(),
    tableView: 'bin',
    expanded: false
};

function createTrieMap(): TrieMap {
    return {
        keysToHashes: new Map(),
        hashesToValues: new Map(),
        keysToValues: new Map()
    };
}

export const getKeysAndValues = (state: State): KeysAndValues => state.keysAndValues;

export default (state: KeysAndValues = initialState, action: Action) => {
    switch (action.type) {
        case KNVS_SET_TABLE_VIEW:
            return {...state, tableView: action.payload};
        case INSERT_INSERT_DONE:
            const trieMap = state.trieMap;
            const payload = action.payload;
            const newTrieMap = {...trieMap};
            newTrieMap.keysToHashes.set(payload.key, payload.keyHash);
            newTrieMap.hashesToValues.set(payload.valueHash, payload.value);
            newTrieMap.keysToValues.set(payload.key, payload.value);
            return {...state, trieMap: newTrieMap};
        case CONTRACT_DEPLOYED:
            return initialState;
        default:
            return state;
    }
};