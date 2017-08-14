// @flow
import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducers'
import EthereumContainer from './components/EthereumContainer'

const middleware = [thunk];

if (process.env.NODE_ENV !== 'production') {
    //middleware.push(createLogger());
}

const store = createStore(
    reducer,
    applyMiddleware(...middleware)
);

render(
    <Provider store={store}>
        <EthereumContainer/>
    </Provider>,
    document.getElementById('app')
);