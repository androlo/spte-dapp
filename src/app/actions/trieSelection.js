// @flow
import {
    TRIE_SET_CURRENT_SELECTED,
    TRIE_SET_PREVIOUS_SELECTED
} from '../constants/actions'

import type {Bytes32} from "../../web3/types"
import type {Dispatch, GetState, ThunkAction} from "../types/types";

export type SelectionType = '' | 'node' | 'edge'

export type SelectionData = {|
    +type: SelectionType,
    +hash: Bytes32,
    +data: Bytes32,
    +length: number,
    +key: string,
    +keyHash: Bytes32,
    +value: string
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
    type: SelectionType,
    hash: Bytes32,
    data: Bytes32,
    length: number,
    key: string,
    keyHash: Bytes32,
    value: string
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
        let payload = null;
        switch (type) {
            case "":
                payload = {
                    type: type,
                    hash: "",
                    data: "",
                    length: 0,
                    key: "",
                    keyHash: "",
                    value: ""
                };
                break;
            case "node":
                payload = {
                    type: type,
                    hash: hash,
                    data: "",
                    length: 0,
                    key: key,
                    keyHash: keyHash,
                    value: value
                };
                break;
            case "edge":
                payload = {
                    type: type,
                    hash: "",
                    data: data,
                    length: length,
                    key: "",
                    keyHash: "",
                    value: ""
                };
                break;
            default:
                throw new Error("Unknown type name passed to 'setSelectedElement");
        }
        if (current) {
            dispatch(setCurrentSelected(payload));
        } else {
            dispatch(setPreviousSelected(payload));
        }
    };
}