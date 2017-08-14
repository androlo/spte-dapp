// @flow
import {
    TRIE_UPDATING,
    TRIE_UPDATE,
    TRIE_NO_UPDATE,
    TRIE_UPDATE_ERROR
} from '../constants/actions'

import type {State, Action} from '../types/types'
import type {TrieData} from "../actions/trie"

export type Trie = {
    +updating: boolean,
    +updateError: string,
    +currentTrie: ?TrieData,
    +previousTrie: ?TrieData
}

const initialState: Trie = {
    updating: false,
    updateError: "",
    currentTrie: null,
    previousTrie: null
};

export const getTrie = (state: State): Trie => state.trie;

export default (state: Trie = initialState, action: Action) => {
    switch (action.type) {
        case TRIE_UPDATING:
            return {...state, updating: true, updateError: null};
        case TRIE_UPDATE:
            if (action.payload) {
                return {...initialState, currentTrie: action.payload, previousTrie: state.currentTrie};
            }
            throw new Error("Type error in action");
        case TRIE_NO_UPDATE:
            return {...state, updating: false, updateError: null};
        case TRIE_UPDATE_ERROR:
            if (action.payload) {
                return {...initialState, updateError: action.payload};
            }
            throw new Error("Type error in action");
        default:
            return state;
    }
};