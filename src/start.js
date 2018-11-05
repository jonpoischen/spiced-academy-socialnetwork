import React from 'react';
import ReactDOM from 'react-dom';
import { Welcome } from './welcome.js';
import { App } from './app.js';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer.js';
import {initSocket} from './socket.js';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

if(location.pathname === '/welcome') {
    ReactDOM.render(
        <Welcome />,
        document.querySelector('main')
    );
} else {
    initSocket(store);
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.querySelector('main')
    );
}
