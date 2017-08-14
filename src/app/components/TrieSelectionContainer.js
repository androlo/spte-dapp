// @flow
import React from 'react'
import {Grid} from 'material-ui'
import {Card, CardContent} from 'material-ui'
import {List, ListItem, ListItemText} from 'material-ui'
import {connect} from 'react-redux'
import {getTrieSelection} from '../reducers/trieSelection'
import type {SelectionData} from "../actions/trieSelection";
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
    if (trieSelection.type === "") {
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
    } else if (trieSelection.type === "node") {
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
                        primary="Hash"
                        secondary={trieSelection.hash}
                    />
                </ListItem>
            </List>
        );
    } else if (trieSelection.type === "edge") {
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
                        secondary={trieSelection.data}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Length"
                        secondary={trieSelection.length}
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