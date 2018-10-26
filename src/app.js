import React from 'react';
import axios from './axios.js';
import { ProfilePic } from './profilepic.js';
import Uploader from './uploader.js';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
    }
    componentDidMount() {
        axios.get('/user').then(
            ({data}) => {
                this.setState({...data});
            }
        );
    }
    setImage(image) {
        this.setState({
            image: image,
            uploadStatus: false
        });
    }
    showUploader() {
        this.setState({
            uploadStatus: true
        });
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <div className="logobox">
                <img className="logo" src="/fakebook.png" />
                <ProfilePic
                    image={this.state.image}
                    first={this.state.first}
                    last={this.state.last}
                    id={this.state.id}
                    clickHandler={this.showUploader}
                />
                {this.state.uploadStatus && <Uploader />}
            </div>
        );
    }
}
