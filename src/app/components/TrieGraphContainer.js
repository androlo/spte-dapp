// @flow
import React from 'react'
import {Grid} from 'material-ui'
import {Card, CardContent, CardHeader} from 'material-ui'
import {Radio, RadioGroup} from 'material-ui'
import {FormLabel, FormControl, FormControlLabel} from 'material-ui';
import {Typography} from 'material-ui'

import {connect} from 'react-redux'
import vis from 'vis'
import {getTrie} from '../reducers/trie'
import {setSelectedElement} from '../actions/trieSelection'
import type {Dispatch, State} from "../types/types"
import type {Trie, TrieView} from "../reducers/trie"
import type {SelectionData, SelectionType} from "../actions/trieSelection"
import type {Bytes32} from "../../web3/types"
import type {EdgeData, NodeData} from "../actions/trie"
import {createNullSelection} from "../reducers/trieSelection"
import {setTrieView} from "../actions/trie";

const graphStyle = {
    width: "100%",
    height: "400px",
    border: "1px solid lightgray",
    background: "#DCDCDC"
};

// provide the data in the vis format
const emptyTrieData = {
    nodes: [],
    edges: []
};

const rootColor: string = "#b16ecc";
const leafColor: string = "#53BA04";

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

        const options = {
            layout: {
                hierarchical: {
                    nodeSpacing: 250,
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
            },
            physics: {
                enabled: false
            }
        };

        currentNetwork = new vis.Network(currentContainer, emptyTrieData, options);
        previousNetwork = new vis.Network(previousContainer, emptyTrieData, options);

        currentNetwork.on('select', function (params) {
            const trie = this.props.trie.currentTrie;
            if (!trie) {
                return;
            }
            if (params.nodes.length === 1) {
                const nodeId = params.nodes[0];
                const node = trie.nodes[nodeId];
                this.props.setSelectedElement(true, {type: 'node', element: node});
            }
            else if (params.edges.length === 1) {
                const edgeId = params.edges[0];
                const edge = trie.edges[edgeId];
                this.props.setSelectedElement(true, {type: 'edge', element: edge});
            } else {
                this.props.setSelectedElement(true, createNullSelection());
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
                this.props.setSelectedElement(false, {type: 'node', element: node});
            }
            else if (params.edges.length === 1) {
                const edgeId = params.edges[0];
                const edge = trie.edges[edgeId];
                this.props.setSelectedElement(false, {type: 'edge', element: edge});
            } else {
                this.props.setSelectedElement(false, createNullSelection());
            }
        }.bind(this));
    }

    render() {
        const currentTrie = this.props.trie.currentTrie;
        const previousTrie = this.props.trie.previousTrie;
        const view = this.props.trie.trieView;
        if (currentNetwork) {
            if (currentTrie) {
                const data = {
                    rootHash: currentTrie.rootHash,
                    nodes: currentTrie.nodes.map(formatNode(view)),
                    edges: currentTrie.edges.map(formatEdge(view))
                };
                currentNetwork.setData(data);
            } else {
                currentNetwork.setData(emptyTrieData);
            }
        }
        if (previousNetwork) {
            if (previousTrie) {
                const data = {
                    rootHash: previousTrie.rootHash,
                    nodes: previousTrie.nodes.map(formatNode(view)),
                    edges: previousTrie.edges.map(formatEdge(view))
                };
                previousNetwork.setData(data);
            } else {
                previousNetwork.setData(emptyTrieData);
            }
        }
        return (
            <Card>
                <CardContent>
                    <FormControl>
                        <FormLabel component="legend">Node Labels</FormLabel>
                        <RadioGroup
                            row
                            name="view"
                            selectedValue={this.props.trie.trieView}
                            onChange={this.handleRadioChange}
                        >
                            <FormControlLabel value="hex" control={<Radio/>} label="Hex"/>
                            <FormControlLabel value="utf-8" control={<Radio/>} label="Utf-8"/>
                        </RadioGroup>
                    </FormControl>
                    <Grid container spacing={8}>
                        <Grid item xs={6}>
                            <Typography type="headline">
                                Current Trie
                            </Typography>
                            <div id="current-trie-graph" style={graphStyle}/>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography type="headline">
                                Previous Trie
                            </Typography>
                            <div id="previous-trie-graph" style={graphStyle}/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    handleRadioChange = (event: Event, value): void => {
        this.props.setTrieView(value);
    };
}

function formatNode(view: TrieView): (nodeData: NodeData) => NodeData {
    return (nodeData: NodeData): NodeData => {
        switch (view) {
            case 'hex':
                nodeData.label = nodeData.hash.substr(2, 12) + '...';
                break;
            case 'utf-8':
                nodeData.label = nodeData.value.length > 10 ? nodeData.value.substr(0, 10) + "..." : nodeData.value;
                break;
        }
        if (nodeData.id === 0) {
            nodeData.color = rootColor;
        }
        if (nodeData.value !== "") {
            nodeData.color = leafColor;
        }
        return nodeData;
    };
}

function formatEdge(view: TrieView): (edgeData: EdgeData) => EdgeData {
    return (edgeData: EdgeData): EdgeData => {
        const dataBin = edgeData.trieLabel.dataBin;
        const length = edgeData.trieLabel.length;
        const dataLabel = length > 12 ? dataBin.substr(0, 10) + "..." : dataBin.substr(0, length);
        switch (view) {
            case 'hex':
                edgeData.label = `D: ${dataLabel}\nL: ${length}`;
                break;
            case 'utf-8':
                edgeData.label = "";
                break;
        }
        return edgeData;
    };
}

const mapStateToProps = (state: State): {
    trie: Trie
} => ({
    trie: getTrie(state)
});

const mapDispatchToProps = (dispatch: Dispatch): {
    setSelectedElement: (current: boolean, data: SelectionData) => void,
    setTrieView: (view: TrieView) => void
} => {
    return {
        setSelectedElement: (current: boolean, data: SelectionData) => {
            dispatch(setSelectedElement(current, data));
        },
        setTrieView: (view: TrieView) => {
            dispatch(setTrieView(view));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrieGraphContainer)