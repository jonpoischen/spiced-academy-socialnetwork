import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Registration from './registration';
import Login from './login';

export function Welcome() {
    return (
        <div className="logobox">
            <img className="logo" src="/fakebook.png" />
            <BrowserRouter>
                <div>
                    <Route path="/welcome" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </BrowserRouter>
        </div>
    );
}
