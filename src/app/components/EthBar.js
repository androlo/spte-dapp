// @flow
import React from 'react'
import {AppBar} from 'material-ui'
import {Toolbar} from 'material-ui'
import {Typography} from 'material-ui'

const EthBar = ({dappName}: { dappName: string }) => (
    <AppBar position="static">
        <Toolbar>
            <Typography type="title" color="inherit">
                {dappName}
            </Typography>
        </Toolbar>
    </AppBar>
);

export default EthBar;