// @flow
import {
    TRIE_SET_CURRENT_SELECTED,
    TRIE_SET_PREVIOUS_SELECTED,
    INSERT_INSERT_DONE,
    CONTRACT_DEPLOYED, TRIE_UPDATE
} from '../constants/actions'

import type {State, Action} from '../types/types'
import type {NullSelection, SelectionData} from '../actions/trieSelection'
import type {Bytes32} from "../../web3/types";

export type TrieMap = {|
    +keysToHashes: Map<string, Bytes32>,
    +hashesToValues: Map<Bytes32, string>,
    +keysToValues: Map<string, string>
|}

export type TrieSelection = {
    currentTrie: SelectionData,
    previousTrie: SelectionData,
    trieMap: TrieMap
}

const initialState: TrieSelection = {
    currentTrie: createNullSelection(),
    previousTrie: createNullSelection(),
    trieMap: createTrieMap()
};

export function createNullSelection(): NullSelection {
    return {
        type: '',
        element: null
    }
}

function createTrieMap(): TrieMap {
    return {
        keysToHashes: new Map(),
        hashesToValues: new Map(),
        keysToValues: new Map()
    };
}

export const getTrieSelection = (state: State): TrieSelection => state.trieSelection;

export default (state: TrieSelection = initialState, action: Action) => {
    switch (action.type) {
        case TRIE_SET_CURRENT_SELECTED:
            return {...state, currentTrie: action.payload};
        case TRIE_SET_PREVIOUS_SELECTED:
            return {...state, previousTrie: action.payload};
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
        case TRIE_UPDATE:
            return initialState;
        default:
            return state;
    }
};