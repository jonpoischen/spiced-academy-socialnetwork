import React from 'react';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <button className="friendButton">Add Friend</button>
        );
    }
}

// <FriendButton otherId = {this.props.match.params.id} />
// in the mount get the friendship status
