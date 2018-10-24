import React from 'react';
import axios from 'axios';

export class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    handleSubmit(evt) {
        // console.log(this.state);
        evt.preventDefault();
        axios.post('/register', this.state)
        .then(res => {
            location.replace('/');
        });
    }

    render() {
        return (
            <div>
                <div className="logobox">
                    <img className="logo" src="/fakebook.png" />
                </div>
                <div className="formcontainer">
                    <div className="formarea">
                        <div className="title">Create a New Account</div>
                        <div className="subtitle">It’s free and always will be.</div>
                        <br />
                        <form onSubmit={this.handleSubmit}>
                            <input className="username inputfield" placeholder="First name" name="firstname" type="text" onChange={this.handleChange} autoComplete="off" required />
                            <input className="username inputfield" placeholder="Last name" name="lastname" type="text" onChange={this.handleChange} autoComplete="off" required /><br /><br />
                            <input className="emailpw inputfield" name="email" placeholder="Mobile number or email" type="email" onChange={this.handleChange} autoComplete="off" required /><br /><br />
                            <input className="emailpw inputfield" name="password" placeholder="New password" type="password" onChange={this.handleChange} autoComplete="off" required /><br /><br />
                            <p className="ta">By clicking Sign Up, you agree to our Terms. Learn how we collect, use and share your data in our Data Policy and how we use cookies and similar technology in our Cookies Policy. You may receive SMS Notifications from us and can opt out any time.</p>
                            <button className="submitbutton">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
