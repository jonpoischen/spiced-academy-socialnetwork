import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {receiveFriendsAndWannabes, acceptFriendRequest, endFriendship} from './actions.js';

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabes());
    }

    render() {
        const { wannabes, friends, dispatch } = this.props;

        if (!wannabes && !friends) {
            return null;
        }

        return (
            <div>
                {this.props.wannabes.length > 0 && <div className="wannabetitle"><h1>Friend Requests</h1></div>}
                {this.props.wannabes.length == 0 && <div><h1>no wannabes...</h1></div>}

                <div className="wannabeflex">
                    {this.props.wannabes.length > 0 &&
                this.props.wannabes.map(
                    wannabes => (
                        <div className="wannabecontainer" key={wannabes.id}>
                            <img className="wannabepic" src={wannabes.img_url} />
                            <Link to={`/user/${wannabes.id}`}><span><div className="wannabetext">{wannabes.first} {wannabes.last}</div></span></Link>
                            <button className="wannabebutton" onClick={() => dispatch(acceptFriendRequest(wannabes.id))}>Accept</button>
                        </div>
                    )
                )}
                </div>
                {this.props.friends.length > 0 && <div className="friendstitle"><h1>Friends</h1></div>}
                {this.props.friends.length == 0 && <div><h1>no friends...</h1></div>}
                <div className="wannabeflex">
                    {this.props.friends.length > 0 &&
                this.props.friends.map(
                    friends => (
                        <div className="wannabecontainer" key={friends.id}>
                            <img className="wannabepic" src={friends.img_url} />
                            <div className="wannabetext">{friends.first} {friends.last}</div>
                            <button className="wannabebutton" onClick={() => dispatch(endFriendship(friends.id))}>Unfriend</button>
                        </div>
                    )
                )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        wannabes: state.friendsAndWannabes && state.friendsAndWannabes.filter(
            friendsOrWannabes => !friendsOrWannabes.accepted
        ),
        friends: state.friendsAndWannabes && state.friendsAndWannabes.filter(
            friendsOrWannabes => friendsOrWannabes.accepted
        )
    };
};

export default connect(mapStateToProps)(Friends);
