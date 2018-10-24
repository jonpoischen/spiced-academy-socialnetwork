import React from 'react';
import ReactDOM from 'react-dom';
import { Welcome } from './welcome.js';

if(location.pathname === '/welcome') {
    ReactDOM.render(
        <Welcome />,
        document.querySelector('main')
    );
} else {
    ReactDOM.render(
        <img src="/fakebook.png" style={{width:"250px"}} />,
        document.querySelector('main')
    );
}
