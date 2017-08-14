// @flow
import {
    CONTRACT_DEPLOYED,
    CONTRACT_DEPLOYING,
    CONTRACT_DEPLOYMENT_ERROR
} from '../constants/actions';

import type {State, Action} from '../types/types'

export type Deploy = {
    +deploying: boolean,
    +deploymentError: string,
    +contractAddress: string
}

const initialState: Deploy = {
    deploying: false,
    deploymentError: "",
    contractAddress: ""
};

export const getDeploy = (state: State): Deploy => state.deploy;

export default (state: Deploy = initialState, action: Action): Deploy => {
    switch (action.type) {
        case CONTRACT_DEPLOYING:
            return {...initialState, deploying: true};
        case CONTRACT_DEPLOYED:
            if (action.payload) {
                return {...initialState, contractAddress: action.payload};
            }
            throw new Error("Type error in action");
        case CONTRACT_DEPLOYMENT_ERROR:
            if (action.payload) {
                return {...initialState, deploymentError: action.payload};
            }
            throw new Error("Type error in action");
        default:
            return state;
    }
};