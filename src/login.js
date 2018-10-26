import React from 'react';
import axios from './axios.js';
import { Link } from 'react-router-dom';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.error;
    }

    handleChange(evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    handleSubmit(evt) {
        evt.preventDefault();
        console.log("trying axios");
        axios.post('/login', this.state)
            .then(data => {
                console.log("got axios then data");
                if (data.data.success) {
                    location.replace('/');
                } else {
                    this.setState({error: true});
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <div className="formcontainer extrapadding">
                <Link to="/" className="loginregisterbutton" style={{ textDecoration: 'none' }}>Sign Up</Link>
                <div className="loginbox">
                    <div className="formarea">
                        <div className="subtitle">Log Into Fakebook</div>
                        {this.state.error && <div className="error">Email or password is incorrect</div>}
                        <br />
                        <form onSubmit={this.handleSubmit}>
                            <input className="emailpw2 inputfield" name="email" placeholder="Email or Phone Number" type="email" onChange={this.handleChange} autoComplete="off" required /><br /><br />
                            <input className="emailpw2 inputfield" name="password" placeholder="Password" type="password" onChange={this.handleChange} autoComplete="off" required /><br /><br />
                            <button className="loginbutton">Log In</button>
                            <p className="fakelink">Forgot account? · Sign up for Fakebook</p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
