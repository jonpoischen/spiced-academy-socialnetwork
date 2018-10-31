import React from 'react';
import axios from './axios.js';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "Add Friend"
        };
        this.friendButtonAction = this.friendButtonAction.bind(this);
    }

    componentDidMount() {
        axios.get('/friendship-status', {
            params: {
                id: this.props.receiverId
            }
        })
            .then(results => {
                let status;
                if (!results.data) {
                    status = "Add Friend";
                } else if (!results.data.accepted && this.props.receiverId == results.data.sender_id) {
                    status = "Accept";
                } else if (!results.data.accepted && this.props.receiverId == results.data.receiver_id) {
                    status = "Cancel";
                } else {
                    status = "Unfriend";
                }
                this.setState({
                    status: status
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    friendButtonAction() {
        if(this.state.status == "Add Friend") {
            axios.post('/send-friend-request', {
                id: this.props.receiverId
            }).then(results => {
                // this.friendshipId = results.data.id;
                if(!results.data.accepted) {
                    this.setState({
                        status : "Cancel"
                    });
                }
            }).catch(err => console.log(err));
        } else if (this.state.status == "Accept") {
            axios.post('/accept-friend-request', {
                receiver_id: this.props.receiverId
            }).then(results => {
                if(results.data.accepted) {
                    this.setState({
                        status : "Unfriend"
                    });
                }
            }).catch(err => console.log(err));
        } else if (this.state.status == "Unfriend" || this.state.status == "Cancel") {
            axios.post('/end-friendship', {
                receiver_id: this.props.receiverId
            }).then(() => {
                this.setState({
                    status : "Add Friend"
                });
            }).catch(err => console.log(err));
        }
    }

    render () {
        return (
            <button className="friendButton" onClick={this.friendButtonAction}>{this.state.status}</button>
        );
    }
}
