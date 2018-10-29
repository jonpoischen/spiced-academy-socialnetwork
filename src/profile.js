import React from 'react';
import {ProfilePic} from './profilepic.js';
import Bio from './bio.js';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="profile formcontainer">
                <img className="coverphoto" src="/fakebook_cover.jpeg" />
                <p className="profilename">{this.props.first} {this.props.last}</p>
                <ProfilePic
                    cssClass = {'bigusericon'}
                    image={this.props.image}
                    first={this.props.first}
                    last={this.props.last}
                    id={this.props.id}
                    clickHandler={this.props.showUploader}
                />
                <div className="streamflex">
                    <div className="leftstream">
                        <Bio bio={this.props.bio} setBio={this.props.setBio} />
                    </div>
                    <div className="rightstream">
                        <p>Hi</p>
                    </div>
                </div>
            </div>
        );
    }
}
