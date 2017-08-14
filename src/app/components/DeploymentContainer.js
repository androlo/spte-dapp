// @flow
import React, {Component} from 'react'
import {Card, CardActions, CardContent} from 'material-ui'
import {Typography} from 'material-ui'
import {Button} from 'material-ui'
import {LinearProgress} from 'material-ui'
import {getDeploy} from '../reducers/deploy'
import {getInsert} from '../reducers/insert'
import {getTrie} from '../reducers/trie'
import {deploy} from '../actions/deploy'
import {connect} from 'react-redux'

import type {Dispatch, State} from "../types/types"
import type {Deploy} from "../reducers/deploy"
import type {Insert} from "../reducers/insert"
import type {Trie} from "../reducers/trie"

const style = {
    color: "#892d34"
};

class DeploymentContainer extends Component {

    props: {
        deploy: Deploy,
        insert: Insert,
        trie: Trie,
        onDeployClick: () => void,
        dispatch: Dispatch
    };

    render() {
        const contractAddress = this.props.deploy.contractAddress;
        const deploying = this.props.deploy.deploying;
        const deploymentError = this.props.deploy.deploymentError;

        const inserting = this.props.insert.inserting;
        const updating = this.props.trie.updating;

        const deployingDisabled = deploying || inserting || updating;

        return (
            <Card>
                <CardContent>
                    <Typography type="headline" component="h2">
                        Current Contract
                    </Typography>
                    <Typography type="body1">
                        {contractAddress || "-"}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        raised
                        color="accent"
                        disabled={deployingDisabled}
                        onClick={this.props.onDeployClick}
                    >
                        Deploy New
                    </Button>
                </CardActions>
                <CardContent>
                    {deploy.deploying &&
                    <LinearProgress mode="indeterminate"/>
                    }
                    {deploymentError &&
                    <div style={style}>Deployment error: {deploymentError} </div>
                    }
                </CardContent>
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
    onDeployClick: () => void
} => {
    return {
        onDeployClick: () => {
            dispatch(deploy())
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeploymentContainer)