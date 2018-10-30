import React from 'react';
import axios from './axios.js';
import Profile from './profile.js';
import { ProfilePic } from './profilepic.js';
import Uploader from './uploader.js';
import { BrowserRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Opp from './opp.js';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    componentDidMount() {
        axios.get('/user').then(
            ({data}) => {
                this.setState({...data});
            }
        );
    }
    setBio(bio) {
        this.setState({
            bio: bio
        });
    }
    setImage(image) {
        this.setState({
            img_url: image,
            uploadStatus: false
        });
    }
    showUploader() {
        if (this.state.uploadStatus === true) {
            this.setState({
                uploadStatus: false
            });
        } else {
            this.setState({
                uploadStatus: true
            });
        }
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <BrowserRouter>
                <div className="logobox mainbox">
                    <div className="flexcontainer">
                        <div className="searcharea">
                            <img className="tinylogo" src="/fbicon.png" />
                            <input className="search inputfield whitebg" autoComplete="off" placeholder="Search" />
                        </div>
                        <div className="toptabsflex">
                            <div className="usertab">
                                <ProfilePic
                                    image={this.state.img_url}
                                    first={this.state.first}
                                    last={this.state.last}
                                    id={this.state.id}
                                    clickHandler={this.showUploader}
                                />
                                <Link to="/profile"><span className="username">{this.state.first}</span></Link>
                            </div>
                            <div className="usertab">
                                <Link to="/"><span>Home</span></Link>
                            </div>
                            <div className="usertab">
                                <span>Find Friends</span>
                            </div>
                        </div>
                    </div>
                    {this.state.uploadStatus &&
                    <Uploader
                        setImage={ this.setImage }
                    />
                    }
                    <div>
                        <Route path="/profile" render = {
                            () => (
                                <Profile
                                    image = {this.state.img_url}
                                    first = {this.state.first}
                                    last = {this.state.last}
                                    id = {this.state.id}
                                    bio = {this.state.bio}
                                    clickHandler = {this.showUploader}
                                    setBio = {this.setBio}
                                />
                            )
                        } />

                        <Route
                            path = "/user/:id"
                            render = {props => (
                                <Opp
                                    {...props}
                                    key = {props.match.url}
                                />
                            )}
                        />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
