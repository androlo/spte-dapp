// @flow
import {
    KNVS_SET_TABLE_VIEW
} from '../constants/actions'

import type {TableView} from "../reducers/keysAndValues";

export type SetTableViewAction = {|
    +type: typeof KNVS_SET_TABLE_VIEW,
    +payload: TableView
|}

export type KeysAndValuesAction = SetTableViewAction;

export function setTableView(view: TableView): SetTableViewAction {
    return {
        type: KNVS_SET_TABLE_VIEW,
        payload: view
    }
}
