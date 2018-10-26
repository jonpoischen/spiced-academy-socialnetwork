import React from 'react';
import ReactDOM from 'react-dom';
import { Welcome } from './welcome.js';
import { App } from './app.js';

if(location.pathname === '/welcome') {
    ReactDOM.render(
        <Welcome />,
        document.querySelector('main')
    );
} else {
    ReactDOM.render(
        <App />,
        document.querySelector('main')
    );
}
