// @flow
import {
    INSERT_INSERTING,
    INSERT_INSERT_DONE,
    INSERT_INSERTION_ERROR,
    INSERT_KEY,
    INSERT_KEY_ERROR,
    INSERT_VALUE,
    INSERT_VALUE_ERROR
} from '../constants/actions'

import {FIELD_EMPTY_ERROR} from '../constants/errors'

import type {State, Action} from '../types/types'

export type Insert = {
    inserting: boolean,
    insertError: string,
    key: string,
    keyError: string,
    value: string,
    valueError: string
}

const initialState: Insert = {
    inserting: false,
    insertError: "",
    key: "",
    keyError: FIELD_EMPTY_ERROR,
    value: "",
    valueError: FIELD_EMPTY_ERROR
};

export const getInsert = (state: State): Insert => state.insert;

export default (state: Insert = initialState, action: Action) => {
    switch (action.type) {
        case INSERT_INSERTING:
            return {...state, inserting: true, insertError: ""};
        case INSERT_INSERT_DONE:
            return {...state, inserting: false, insertError: ""};
        case INSERT_INSERTION_ERROR:
            return {...state, inserting: false, insertError: action.payload};
        case INSERT_KEY:
            return {...state, key: action.payload, keyError: ""};
        case INSERT_KEY_ERROR:
            return {...state, key: "", keyError: action.payload};
        case INSERT_VALUE:
            return {...state, value: action.payload, valueError: ""};
        case INSERT_VALUE_ERROR:
            return {...state, value: "", valueError: action.payload};
        default:
            return state;
    }
};