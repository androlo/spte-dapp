// @flow
import type {Deploy} from '../reducers/deploy'
import type {Ethereum} from '../reducers/ethereum'
import type {Trie} from "../reducers/trie"
import type {TrieSelection} from "../reducers/trieSelection"
import type {Insert} from "../reducers/insert"
import type {GetProof} from "../reducers/getProof"
import type {Keccak256} from "../reducers/keccak256"
import type {KeysAndValues} from "../reducers/keysAndValues"

import type {DeployAction} from '../actions/deploy'
import type {EthereumAction} from '../actions/ethereum'
import type {TrieAction} from '../actions/trie'
import type {TrieSelectionAction} from '../actions/trieSelection'
import type {InsertAction} from '../actions/insert'
import type {GetProofAction} from '../actions/getProof'
import type {Keccak256Action} from "../actions/keccak256"
import type {KeysAndValuesAction} from "../actions/keysAndValues"

export type State = {|
    +deploy: Deploy,
    +ethereum: Ethereum,
    +trie: Trie,
    +trieSelection: TrieSelection,
    +insert: Insert,
    +getProof: GetProof,
    +keccak256: Keccak256,
    +keysAndValues: KeysAndValues
|}

export type Action = DeployAction |
    EthereumAction |
    TrieAction |
    TrieSelectionAction |
    InsertAction |
    GetProofAction |
    Keccak256Action |
    KeysAndValuesAction

export type DispatchReturn = void | Promise<void>

export type Dispatch = (action: Action | ThunkAction) => DispatchReturn

export type GetState = () => State

export type ThunkAction = (dispatch: Dispatch, getState: GetState) => DispatchReturn

export type PTInputEvent = Event & { target: HTMLInputElement }