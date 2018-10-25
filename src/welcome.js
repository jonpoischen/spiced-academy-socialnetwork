import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Registration from './registration';
import Login from './login';

export function Welcome() {
    return (
        <div className="logobox">
            <img className="logo" src="/fakebook.png" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
