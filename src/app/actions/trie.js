// @flow
import PatriciaTrieContractProvider from '../lib/PatriciaTrieContractProvider'
import {B32_ZERO} from '../constants/constants'
import type {Edge} from "../lib/PatriciaTrieContractProvider"
import type {Bytes32} from "../../web3/types"
import type {Dispatch, GetState, ThunkAction} from "../types/types"

import {
    TRIE_UPDATING,
    TRIE_UPDATE,
    TRIE_UPDATE_ERROR,
    TRIE_NO_UPDATE,
    TRIE_SET_VIEW
} from '../constants/actions'
import type {TrieView} from "../reducers/trie";
import {hashToBin256} from "./utils";

export type NodeData = {
    +id: number,
    +hash: Bytes32,
    +value: string
}

export type EdgeData = {
    +id: number,
    +from: number,
    +to: number,
    +arrows: 'to',
    +trieLabel: {
        +data: Bytes32,
        +length: number
    }
}

export type TrieData = {|
    +rootHash: Bytes32,
    +nodes: NodeData[],
    +edges: EdgeData[]
|}

export type TrieUpdatingAction = {|
    +type: typeof TRIE_UPDATING
|}

export type TrieUpdateAction = {|
    +type: typeof TRIE_UPDATE,
    +payload: TrieData
|}

export type TrieNoUpdateAction = {|
    +type: typeof TRIE_NO_UPDATE
|}

export type TrieUpdateErrorAction = {|
    +type: typeof TRIE_UPDATE_ERROR,
    +payload: string
|}

export type TrieSetViewAction = {|
    +type: typeof TRIE_SET_VIEW,
    +payload: TrieView
|}

export type TrieAction = TrieUpdatingAction | TrieUpdateAction | TrieNoUpdateAction | TrieUpdateErrorAction

function compare(a: NodeData | EdgeData, b: NodeData | EdgeData): 0 | 1 | -1 {
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }
    return 0;
}

function setTrieUpdating(): TrieUpdatingAction {
    return {
        type: TRIE_UPDATING
    };
}

function setTrieUpdate(trie: TrieData): TrieUpdateAction {
    return {
        type: TRIE_UPDATE,
        payload: trie
    };
}

function setTrieNoUpdate(): TrieNoUpdateAction {
    return {
        type: TRIE_NO_UPDATE
    };
}

function setTrieUpdateError(err: string): TrieUpdateErrorAction {
    return {
        type: TRIE_UPDATE_ERROR,
        payload: err
    };
}

export function setTrieView(view: TrieView): TrieSetViewAction {
    return {
        type: TRIE_SET_VIEW,
        payload: view
    };
}

export function updateTrie(): ThunkAction {

    return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
        const deploy = getState().deploy;
        const insert = getState().insert;
        const trie = getState().trie;
        const trieSelection = getState().trieSelection;

        if (!deploy.contractAddress) {
            return Promise.reject(new Error("update trie action no-op: contract not deployed"));
        }
        if (insert.inserting) {
            return Promise.reject(new Error("update trie action no-op: currently inserting"));
        }
        if (trie.updating) {
            return Promise.reject(new Error("update trie action no-op: already updating"));
        }

        const patriciaTrieContract = PatriciaTrieContractProvider.patriciaTrieContract();
        dispatch(setTrieUpdating());

        let nodeId = 0;
        let edgeId = 0;
        const nodes: NodeData[] = [];
        const edges: EdgeData[] = [];

        const rootHash = await patriciaTrieContract.getRootHash();

        // If we already have a trie cached, and the root hash of the one on-chain is
        // the same, then there is no need to update.
        if (trie.trie && trie.trie.rootHash === rootHash) {
            dispatch(setTrieNoUpdate());
            return Promise.resolve();
        }

        nodes.push({
            id: nodeId++,
            hash: rootHash,
            value: ""
        });

        const rootEdge = await patriciaTrieContract.getRootEdge();

        try {
            await parseTrie(0, rootEdge);
        } catch (err) {
            dispatch(setTrieUpdateError(err.message));
            return Promise.resolve();
        }

        dispatch(setTrieUpdate({
            rootHash: rootHash,
            nodes: nodes.sort(compare),
            edges: edges.sort(compare)
        }));

        return Promise.resolve();

        async function parseTrie(parentId: number, edge: Edge): Promise<void> {
            const children = await patriciaTrieContract.getNode(edge.node);
            const id = nodeId++;
            const trieMap = trieSelection.trieMap;
            let value = "";
            if (trieMap.hashesToValues.has(edge.node)) {
                value = trieMap.hashesToValues.get(edge.node);
            }

            nodes.push({
                id: id,
                hash: edge.node,
                value: value
            });

            edges.push({
                id: edgeId++,
                from: parentId,
                to: id,
                arrows: 'to',
                trieLabel: {
                    data: edge.data,
                    dataBin: hashToBin256(edge.data),
                    length: edge.length
                }
            });
            if (children.child0.node !== B32_ZERO) {
                await parseTrie(id, children.child0);
            }
            if (children.child1.node !== B32_ZERO) {
                await parseTrie(id, children.child1);
            }
            return Promise.resolve();
        }

    };
}