// @flow
import React from 'react'
import {Grid} from 'material-ui'
import {Card, CardContent} from 'material-ui'
import {connect} from 'react-redux'
import vis from 'vis'
import {getTrie} from '../reducers/trie'
import {setSelectedElement} from '../actions/trieSelection'
import type {Dispatch, State} from "../types/types";
import type {Trie} from "../reducers/trie";
import type {SelectionType} from "../actions/trieSelection";
import type {Bytes32} from "../../web3/types";

let graphStyle = {
    width: "100%",
    height: "400px",
    border: "1px solid lightgray",
    background: "#DCDCDC"
};

let currentNetwork = null;
let previousNetwork = null;

class TrieGraphContainer extends React.Component {

    props: {
        trie: Trie,
        setSelectedElement: (current: boolean, type: SelectionType, hash: Bytes32, data: Bytes32, length: number) => void
    };

    componentDidMount() {
        // create a network
        const currentContainer = document.getElementById('current-trie-graph');
        const previousContainer = document.getElementById('previous-trie-graph');

        // provide the data in the vis format
        const d = {
            nodes: [],
            edges: []
        };

        const options = {
            layout: {
                hierarchical: {
                    direction: 'UD',
                    sortMethod: 'directed'
                }
            },
            interaction: {
                selectConnectedEdges: false,
            },
            nodes: {
                shadow: {
                    enabled: true
                }
            }
        };

        // initialize your network!
        currentNetwork = new vis.Network(currentContainer, d, options);
        previousNetwork = new vis.Network(previousContainer, d, options);

        // add event listeners
        currentNetwork.on('select', function (params) {
            const trie = this.props.trie.currentTrie;
            if (!trie) {
                return;
            }
            if (params.nodes.length === 1) {
                const nodeId = params.nodes[0];
                const node = trie.nodes[nodeId];
                this.props.setSelectedElement(true, "node", node.hash, "", 0, node.key, node.keyHash, node.value);
            }
            else if (params.edges.length === 1) {
                const edgeId = params.edges[0];
                const label = trie.edges[edgeId].trieLabel;
                this.props.setSelectedElement(true, "edge", "", label.data, label.length, "", "", "");
            } else {
                this.props.setSelectedElement(true, "", "", "", 0, "", "", "");
            }
        }.bind(this));

        // add event listeners
        previousNetwork.on('select', function (params) {
            const trie = this.props.trie.previousTrie;
            if (!trie) {
                return;
            }
            if (params.nodes.length === 1) {
                const nodeId = params.nodes[0];
                const node = trie.nodes[nodeId];
                this.props.setSelectedElement(false, "node", node.hash, "", 0, node.key, node.keyHash, node.value);
            }
            else if (params.edges.length === 1) {
                const edgeId = params.edges[0];
                const label = trie.edges[edgeId].trieLabel;
                this.props.setSelectedElement(false, "edge", "", label.data, label.length, "", "", "");
            } else {
                this.props.setSelectedElement(false, "", "", "", 0, "", "", "");
            }
        }.bind(this));
    }

    render() {
        const currentTrie = this.props.trie.currentTrie;
        const previousTrie = this.props.trie.previousTrie;

        if (currentTrie && currentNetwork) {
            const data = {
                rootHash: currentTrie.rootHash,
                nodes: currentTrie.nodes,
                edges: currentTrie.edges
            };
            currentNetwork.setData(data);
        }
        if (previousTrie && previousNetwork) {
            const data = {
                rootHash: previousTrie.rootHash,
                nodes: previousTrie.nodes,
                edges: previousTrie.edges
            };
            previousNetwork.setData(data);
        }
        return (
            <Card>
                <CardContent>
                    <Grid container spacing={8}>
                        <Grid item xs={6}>
                            <h3>Current Trie</h3>
                            <h5>{currentTrie ? currentTrie.rootHash : "-"}</h5>
                            <div id="current-trie-graph" style={graphStyle}/>
                        </Grid>
                        <Grid item xs={6}>
                            <h3>Previous Trie</h3>
                            <h5>{previousTrie ? previousTrie.rootHash : "-"}</h5>
                            <div id="previous-trie-graph" style={graphStyle}/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }

}

const mapStateToProps = (state: State): {
    trie: Trie
} => ({
    trie: getTrie(state)
});

const mapDispatchToProps = (dispatch: Dispatch): {
    setSelectedElement: (current: boolean, type: SelectionType, hash: Bytes32, data: Bytes32, length: number, key: string, keyHash: Bytes32, value: string) => void
} => {
    return {
        setSelectedElement: (current: boolean, type: SelectionType, hash: Bytes32, data: Bytes32, length: number, key: string, keyHash: Bytes32, value: string) => {
            dispatch(setSelectedElement(current, type, hash, data, length, key, keyHash, value))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrieGraphContainer)