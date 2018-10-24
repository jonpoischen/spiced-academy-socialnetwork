import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './hello';

if(location.pathname === '/welcome') {
    ReactDOM.render(
        <Hello />,
        document.querySelector('main')
    );
} else {
    ReactDOM.render(
        <div><h1>Bio</h1></div>,
        document.querySelector('main')
    );
}
