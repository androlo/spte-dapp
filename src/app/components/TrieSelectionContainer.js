// @flow
import React from 'react'
import {Grid} from 'material-ui'
import {Card, CardContent} from 'material-ui'
import {List, ListItem, ListItemText} from 'material-ui'
import {connect} from 'react-redux'
import {getTrieSelection} from '../reducers/trieSelection'
import type {EdgeSelection, NodeSelection, SelectionData} from "../actions/trieSelection";
import type {Dispatch, State} from "../types/types";
import type {TrieSelection} from "../reducers/trieSelection";

class TrieSelectionContainer extends React.Component {
    props: {
        trieSelection: TrieSelection,
        dispatch: Dispatch
    };

    render() {
        const currentTrieSelection = this.props.trieSelection.currentTrie;
        const previousTrieSelection = this.props.trieSelection.previousTrie;

        return (
            <Card>
                <CardContent>
                    <Grid container spacing={8}>
                        <Grid item xs={6}>
                            {generateSelectedList(currentTrieSelection)}
                        </Grid>
                        <Grid item xs={6}>
                            {generateSelectedList(previousTrieSelection)}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }

}

function generateSelectedList(trieSelection: SelectionData) {
    switch (trieSelection.type) {
        case '':
            return (
                <List dense>
                    <ListItem>
                        <ListItemText
                            primary="Selection"
                            secondary="-"
                        />
                    </ListItem>
                </List>
            );
        case 'node':
            const node = (trieSelection: NodeSelection).element;
            return (
                <List dense>
                    <ListItem>
                        <ListItemText
                            primary="Selection"
                            secondary="Node"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Value"
                            secondary={node.value}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Value Hash"
                            secondary={node.hash}
                        />
                    </ListItem>
                </List>
            );
        case 'edge':
            const edgeLabel = (trieSelection: EdgeSelection).element.trieLabel;
            return (
                <List dense>
                    <ListItem>
                        <ListItemText
                            primary="Selection"
                            secondary="Edge"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Data"
                            secondary={edgeLabel.data}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Data Binary"
                            secondary={edgeLabel.dataBin}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Length"
                            secondary={edgeLabel.length}
                        />
                    </ListItem>
                </List>
            );
    }
}

const mapStateToProps = (state: State): {
    trieSelection: TrieSelection
} => ({
    trieSelection: getTrieSelection(state)
});

export default connect(
    mapStateToProps
)(TrieSelectionContainer)