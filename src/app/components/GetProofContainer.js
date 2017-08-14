// @flow
import React from 'react'
import {Card, CardActions} from 'material-ui'
import {Button} from 'material-ui'
import {TextField} from 'material-ui'
import {Grid} from 'material-ui'
import {List, ListItem, ListItemText} from 'material-ui'
import {Avatar} from 'material-ui'
import {getDeploy} from '../reducers/deploy'
import {getInsert} from '../reducers/insert'
import {getTrie} from '../reducers/trie'
import {getGetProof} from "../reducers/getProof"
import {getProof, setKeyField, setValueField} from '../actions/getProof'
import {connect} from 'react-redux'

import ThumbUp from 'material-ui-icons/ThumbUp'
import ThumbDown from 'material-ui-icons/ThumbDown'
import green from 'material-ui/colors/green';
import pink from 'material-ui/colors/pink';

import type {Dispatch, PTInputEvent, State} from "../types/types"
import type {Deploy} from "../reducers/deploy"
import type {Insert} from "../reducers/insert"
import type {Trie} from "../reducers/trie"
import type {GetProof} from "../reducers/getProof"
import type {Bytes32} from "../../web3/types"

const tfStyle = {
    width: "30%",
};

const thupStyle = {
    margin: 10,
    color: green[500],
    backgroundColor: "rgba(0, 0, 0, 0.0)"
};

const thdoStyle = {
    margin: 10,
    color: pink[500],
    backgroundColor: "rgba(0, 0, 0, 0.0)"
};

class GetProofContainer extends React.Component {

    props: {
        deploy: Deploy,
        insert: Insert,
        trie: Trie,
        getProof: GetProof,
        onInsertClick: () => void,
        setKey: (event: PTInputEvent) => void,
        setValue: (event: PTInputEvent) => void,
        dispatch: Dispatch
    };

    render() {
        const contractReady = !!this.props.deploy.contractAddress;
        const inserting = this.props.insert.inserting;
        const updating = this.props.trie.updating;
        const hasTrie = !!this.props.trie.currentTrie;
        const getProof = this.props.getProof;
        const getting = getProof.getting;
        const keyError = !!getProof.keyError;
        const getProofDisabled = !contractReady || !hasTrie || inserting || updating || getting || keyError;

        const valid = getProof.valid;
        return (
            <Card>
                <Grid container>
                    <Grid item xs={6}>
                        <CardActions>
                            <Button
                                raised
                                color="primary"
                                disabled={getProofDisabled}
                                onClick={this.props.onInsertClick.bind(this)}
                            >
                                Get Proof
                            </Button>
                            <TextField
                                error={keyError}
                                label="Key"
                                margin="dense"
                                style={tfStyle}
                                onChange={this.props.setKey}
                            />
                            <TextField
                                label="Value (for validation)"
                                margin="dense"
                                style={tfStyle}
                                onChange={this.props.setValue}
                            />
                        </CardActions>
                        {valid === "yes" &&
                        <Avatar style={thupStyle}>
                            <ThumbUp/>
                        </Avatar>}
                        {valid === "no" &&
                        <Avatar style={thdoStyle}>
                            <ThumbDown/>
                        </Avatar>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Bitmask"
                                    secondary={getProof.proof ? '0x' + getProof.proof.branchMask.toString(16) : "-"}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Siblings"
                                />
                            </ListItem>
                            <ListItem>
                                {getProof.proof && generateSiblingsList(getProof.proof.siblings)}
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Card>
        );
    }

}

function generateSiblingsList(siblings: Bytes32[]): List {
    return (
        <List dense>
            {siblings.map(sibling =>
                <ListItem key={sibling}>
                    <ListItemText
                        primary={sibling}
                    />
                </ListItem>
            )}
        </List>
    )
}

const mapStateToProps = (state: State): {
    deploy: Deploy,
    insert: Insert,
    trie: Trie,
    getProof: GetProof
} => ({
    deploy: getDeploy(state),
    insert: getInsert(state),
    trie: getTrie(state),
    getProof: getGetProof(state)
});

const mapDispatchToProps = (dispatch: Dispatch): {
    onInsertClick: () => void,
    setKey: (event: PTInputEvent) => void,
    setValue: (event: PTInputEvent) => void
} => {
    return {
        onInsertClick: function () {
            dispatch(getProof());
        },
        setKey: (event: PTInputEvent) => {
            dispatch(setKeyField(event.target.value));
        },
        setValue: (event: PTInputEvent) => {
            dispatch(setValueField(event.target.value));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GetProofContainer)