// @flow
import {
    TRIE_UPDATING,
    TRIE_UPDATE,
    TRIE_NO_UPDATE,
    TRIE_UPDATE_ERROR,
    TRIE_SET_VIEW, CONTRACT_DEPLOYED
} from '../constants/actions'

import type {State, Action} from '../types/types'
import type {TrieData} from "../actions/trie"

export type TrieView = 'hex' | 'utf-8'

export type Trie = {
    +updating: boolean,
    +updateError: string,
    +currentTrie: ?TrieData,
    +previousTrie: ?TrieData,
    +trieView: TrieView
}

const initialState: Trie = {
    updating: false,
    updateError: "",
    currentTrie: null,
    previousTrie: null,
    trieView: 'hex'
};

export const getTrie = (state: State): Trie => state.trie;

export default (state: Trie = initialState, action: Action) => {
    switch (action.type) {
        case TRIE_UPDATING:
            return {...state, updating: true, updateError: null};
        case TRIE_UPDATE:
            return {
                updating: false,
                updateError: null,
                currentTrie: action.payload,
                previousTrie: state.currentTrie,
                trieView: state.trieView
            };
        case TRIE_NO_UPDATE:
            return {...state, updating: false, updateError: null};
        case TRIE_UPDATE_ERROR:
            return {...initialState, updateError: action.payload};
        case TRIE_SET_VIEW:
            return {...state, trieView: action.payload};
        case CONTRACT_DEPLOYED:
            return {...initialState, trieView: state.trieView};
        default:
            return state;
    }
};