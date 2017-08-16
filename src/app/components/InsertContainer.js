// @flow
import React from 'react'
import {Card, CardActions} from 'material-ui'
import {Button} from 'material-ui'
import {TextField} from 'material-ui'
import {getDeploy} from '../reducers/deploy'
import {getInsert} from '../reducers/insert'
import {getTrie} from '../reducers/trie'
import {insert, setKeyField, setValueField} from '../actions/insert'
import {connect} from 'react-redux'
import {CircularProgress} from 'material-ui'

import type {Dispatch, PTInputEvent, State} from "../types/types"
import type {Deploy} from "../reducers/deploy"
import type {Insert} from "../reducers/insert"
import type {Trie} from "../reducers/trie"

const style = {
    color: "#892d34"
};

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
class InsertContainer extends React.Component {

    props: {
        deploy: Deploy,
        insert: Insert,
        trie: Trie,
        onInsertClick: () => void,
        setKey: (event: PTInputEvent) => void,
        setValue: (event: PTInputEvent) => void,
        dispatch: Dispatch
    };

    render() {
        const contractReady = !!this.props.deploy.contractAddress;
        const inserting = this.props.insert.inserting;
        const updating = this.props.trie.updating;
        const insertError = this.props.insert.insertError;
        const keyError = this.props.insert.keyError;
        const valueError = this.props.insert.valueError;
        const insertDisabled = !contractReady || inserting || updating || !!keyError || !!valueError;
        return (
            <Card>
                <CardActions>
                    <Button
                        raised
                        color="primary"
                        disabled={insertDisabled}
                        onClick={this.props.onInsertClick.bind(this)}
                    >
                        Insert
                    </Button>
                    <TextField
                        error={!!keyError}
                        label="Key"
                        margin="dense"
                        onChange={this.props.setKey}
                    />
                    <TextField
                        error={!!valueError}
                        label="Value"
                        margin="dense"
                        onChange={this.props.setValue}
                    />
                    {inserting && <CircularProgress />}
                    {!!insertError &&
                    <div style={style}>Insert error: {insertError} </div>
                    }
                </CardActions>
            </Card>
        );
    }

}

const mapStateToProps = (state: State): {
    deploy: Deploy,
    insert: Insert,
    trie: Trie
} => ({
    deploy: getDeploy(state),
    insert: getInsert(state),
    trie: getTrie(state)
});

const mapDispatchToProps = (dispatch: Dispatch): {
    onInsertClick: () => void,
    setKey: (event: PTInputEvent) => void,
    setValue: (event: PTInputEvent) => void
} => {
    return {
        onInsertClick: function () {
            dispatch(insert());
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
)(InsertContainer)