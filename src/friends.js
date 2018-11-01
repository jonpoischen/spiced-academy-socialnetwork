import React from 'react';
import { connect } from 'react-redux';
import {receiveFriendsAndWannabes, acceptFriendRequest} from './actions.js';

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabes());
    }

    render() {
        const { wannabes, dispatch } = this.props;
        if (!wannabes) {
            return null;
        }

        return (
            <div>
                <h1>Wannabes</h1>
                {this.props.wannabes.map(
                    wannabes => (
                        <div key={wannabes.id}>
                            {wannabes.first} {wannabes.last}
                            <img src={wannabes.image} />
                            <button onClick={() => dispatch(acceptFriendRequest(wannabes.id))}>Accept</button>
                        </div>
                    )
                )}
            </div>
        );

        // render 2 lists: friends and wannabes
        // these lists are passed as props

        // this list needs to be mapped, creating 2 clones
        // clones should be versions with either friends or wannabes discarded
    }
}

const mapStateToProps = function(state) {
    return {
        wannabes: state.friendsAndWannabes && state.friendsAndWannabes.filter(
            friendsOrWannabes => !friendsOrWannabes.accepted
        )
    };
};

export default connect(mapStateToProps)(Friends);
