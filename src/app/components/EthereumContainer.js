// @flow
import React, {Component} from 'react'
import EthBar from './EthBar'
import PatriciaTrie from "./PatriciaTrie"
import {connect} from 'react-redux'
import {getEthereum} from "../reducers/ethereum"
import {initialize} from "../actions/ethereum"
import type {Dispatch, State} from "../types/types"
import type {Ethereum} from "../reducers/ethereum"

class EthereumContainer extends Component {

    props: {
        ethereum: Ethereum,
        dispatch: Dispatch,
    };

    componentDidMount() {
        this.props.dispatch(initialize());
    }

    render() {
        if (this.props.ethereum.initializing) {
            return <div>Initializing web3</div>
        }
        if (this.props.ethereum.initializationError) {
            return <div>Failed to initialize web3: {this.props.ethereum.initializationError}</div>
        }
        return (
            <div>
                <EthBar dappName="Patricia Trie DApp"/>
                <PatriciaTrie/>
            </div>
        );
    }

}

const mapStateToProps = (state: State): { ethereum: Ethereum } => ({
    ethereum: getEthereum(state)
});

export default connect(
    mapStateToProps
)(EthereumContainer)