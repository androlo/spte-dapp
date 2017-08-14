// @flow
import {
    TRIE_SET_SELECTED,
    TRIE_SET_PREVIOUS_SELECTED
} from '../constants/actions'

import type {State, Action} from '../types/types'
import type {SelectionData} from '../actions/trieSelection'

export type TrieSelection = {
    currentTrie: SelectionData,
    previousTrie: SelectionData
}

const initialState: TrieSelection = {
    currentTrie: createSelectionData(),
    previousTrie: createSelectionData()
};

function createSelectionData() {
    return {
        type: "",
        hash: "",
        data: "",
        length: 0
    }
}

export const getTrieSelection = (state: State): TrieSelection => state.trieSelection;

export default (state: TrieSelection = initialState, action: Action) => {
    switch (action.type) {
        case TRIE_SET_SELECTED:
            return {...state, currentTrie: action.payload};
        case TRIE_SET_PREVIOUS_SELECTED:
            return {...state, previousTrie: action.payload};
        default:
            return state;
    }
};