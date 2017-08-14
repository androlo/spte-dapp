// @flow
import React from 'react'
import {Grid} from 'material-ui'
import {Card, CardActions, CardContent} from 'material-ui'
import {List, ListItem, ListItemText} from 'material-ui'
import {Button} from 'material-ui'
import {TextField} from 'material-ui'
import {Typography} from 'material-ui'
import {Divider} from 'material-ui'
import type {Keccak256} from "../reducers/keccak256"
import {getHash, setInputField} from '../actions/keccak256'
import {connect} from 'react-redux'

import type {Dispatch, PTInputEvent, State} from "../types/types"
import {getKeccak256} from "../reducers/keccak256"

let tfStyle = {
    width: "90%",
};

class Keccak256Container extends React.Component {

    props: {
        keccak256: Keccak256,
        onHashClick: () => void,
        setInput: (event: PTInputEvent) => void,
        dispatch: Dispatch
    };

    render() {
        const keccak256 = this.props.keccak256;
        return (
            <Card>
                <CardContent>
                    <Typography type="headline" component="h2">
                        Keccak256
                    </Typography>
                    <Divider/>
                </CardContent>
                <Grid container>
                    <Grid item xs={6}>
                        <CardActions>
                            <Button
                                raised
                                color="primary"
                                onClick={this.props.onHashClick.bind(this)}
                            >
                                Hash
                            </Button>
                            <TextField
                                label="Input"
                                margin="dense"
                                style={tfStyle}
                                onChange={this.props.setInput}
                            />
                        </CardActions>
                    </Grid>
                    <Grid item xs={6}>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Data"
                                    secondary={keccak256.hashInput || "-"}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Hash"
                                    secondary={keccak256.hash || "-"}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Card>
        );
    }

}

const mapStateToProps = (state: State): {
    keccak256: Keccak256
} => ({
    keccak256: getKeccak256(state)
});

const mapDispatchToProps = (dispatch: Dispatch): {
    onHashClick: () => void,
    setInput: (event: PTInputEvent) => void
} => {
    return {
        onHashClick: function () {
            dispatch(getHash());
        },
        setInput: (event: PTInputEvent) => {
            dispatch(setInputField(event.target.value));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Keccak256Container)