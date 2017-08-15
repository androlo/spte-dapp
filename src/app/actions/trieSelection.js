// @flow
import {
    TRIE_SET_CURRENT_SELECTED,
    TRIE_SET_PREVIOUS_SELECTED
} from '../constants/actions'

import type {Dispatch, GetState, ThunkAction} from "../types/types";
import type {EdgeData, NodeData} from "./trie";

export type SelectionType = '' | 'node' | 'edge'

export type SelectionData = NullSelection | NodeSelection | EdgeSelection

export type NullSelection = {|
    type: '',
    data: null,
|}

export type NodeSelection = {|
    type: 'node',
    data: NodeData,
|}

export type EdgeSelection = {|
    type: 'edge',
    data: EdgeData,
|}

export type CurrentSelectedAction = {|
    +type: typeof TRIE_SET_CURRENT_SELECTED,
    +payload: SelectionData
|}

export type PreviousSelectedAction = {|
    +type: typeof TRIE_SET_PREVIOUS_SELECTED,
    +payload: SelectionData
|}

export type TrieSelectionAction = CurrentSelectedAction | PreviousSelectedAction

function setCurrentSelected(selected: SelectionData): CurrentSelectedAction {
    return {
        type: TRIE_SET_CURRENT_SELECTED,
        payload: selected
    }
}

function setPreviousSelected(selected: SelectionData): PreviousSelectedAction {
    return {
        type: TRIE_SET_PREVIOUS_SELECTED,
        payload: selected
    }
}

export function setSelectedElement(
    current: boolean,
    data: SelectionData
): ThunkAction {
    return (dispatch: Dispatch, getState: GetState): void => {
        if (current) {
            if (!getState().trie.currentTrie) {
                throw new Error("set selected trie element action no-op: trie not set");
            }
        } else {
            if (!getState().trie.previousTrie) {
                throw new Error("set selected trie element action no-op: trie not set");
            }
        }
        if (current) {
            dispatch(setCurrentSelected(data));
        } else {
            dispatch(setPreviousSelected(data));
        }
    };
}