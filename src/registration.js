import React from 'react';
import axios from './axios.js';
import { Link } from 'react-router-dom';

export default class Registration extends React.Component {
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
        this.error;
    }

    handleChange(evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    handleSubmit(evt) {
        evt.preventDefault();
        axios.post('/register', this.state)
            .then(data => {
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
            <div className="formcontainer">
                <Link to="/login" className="loginregisterbutton" style={{ textDecoration: 'none' }}>Log In</Link>
                <div className="flexcontainer">
                    <div className="connectnow">
                        <h2 className="connecttext bolden">Connect with friends and the world around you on Fakebook.</h2>
                        <div className="flexcontainer">
                            <img className="icon" src="/updates.png" />
                            <p className="smallertext"><span className="subtitle bolder" style={{fontWeight: 'bold'}}>See photos and updates</span> from friends in News Feed.</p>
                        </div>
                        <div className="flexcontainer">
                            <img className="icon" src="/new.png" />
                            <p className="smallertext"><span className="subtitle bolder" style={{fontWeight: 'bold'}}>Share what&apos;s new</span> in your life on your Timeline.</p>
                        </div>
                        <div className="flexcontainer">
                            <img className="icon" src="/findmore.png" />
                            <p className="smallertext"><span className="subtitle bolder" style={{fontWeight: 'bold'}}>Find more</span> of what you&apos;re looking for with Facebook Search.</p>
                        </div>
                    </div>
                    <div className="formarea">
                        <div className="title">Sign Up</div>
                        <div className="subtitle">It’s free and always will be.</div>
                        {this.state.error && <div className="error">Please try again, that email might be taken</div>}
                        <br />
                        <form onSubmit={this.handleSubmit}>
                            <input className="username inputfield" placeholder="First name" name="firstname" type="text" onChange={this.handleChange} autoComplete="off" required />
                            <input className="username inputfield" placeholder="Last name" name="lastname" type="text" onChange={this.handleChange} autoComplete="off" required /><br /><br />
                            <input className="emailpw inputfield" name="email" placeholder="Mobile number or email" type="email" onChange={this.handleChange} autoComplete="off" required /><br /><br />
                            <input className="emailpw inputfield" name="password" placeholder="New password" type="password" onChange={this.handleChange} autoComplete="off" required /><br /><br />
                            <input type="hidden" name="_csrf" value="{{csrfToken}}" />
                            <p className="ta">By clicking Sign Up, you agree to our <span className="fakelink">Terms</span>. Learn how we collect, use and share your data in our <span className="fakelink">Data Policy</span> and how we use cookies and similar technology in our <span className="fakelink">Cookies Policy</span>. You may receive SMS Notifications from us and can opt out any time.</p>
                            <button className="submitbutton">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
