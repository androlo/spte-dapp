// @flow
import React from 'react'
import {Grid} from 'material-ui'
import DeploymentContainer from './DeploymentContainer'
import InsertContainer from './InsertContainer'
import TrieGraphContainer from './TrieGraphContainer'
import TrieSelectionContainer from './TrieSelectionContainer'
import GetProofContainer from './GetProofContainer'
import Keccak256Container from './Keccak256Container'
// Display the page.
const PatriciaTrie = () => (
    <div>
        <Grid container spacing={8} direction="column">
            <Grid item xs={12}>
                <DeploymentContainer/>
            </Grid>
            <Grid item xs={12}>
                <InsertContainer/>
            </Grid>
            <Grid item xs={12}>
                <TrieGraphContainer/>
                <TrieSelectionContainer/>
            </Grid>
            <Grid item xs={12}>
                <GetProofContainer/>
            </Grid>
            <Grid item xs={12}>
                <Keccak256Container/>
            </Grid>
        </Grid>
    </div>
);

export default PatriciaTrie;