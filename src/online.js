import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {onlineUsersList, userJoined, userLeft} from './actions.js';

class OnlineUsers extends React.Component {
    componentDidMount() {
        this.props.dispatch(onlineUsersList());
    }

    render() {
        const { users } = this.props;

        if (!users) {
            return null;
        }

        return (
            <div className="friendsContainer">
                {this.props.users.length > 0 && <div className="onlinetitle"><h1>Online Users</h1></div>}
                {this.props.users.length == 0 && <div><h1>No one else online...</h1></div>}

                <div className="wannabeflex">
                    {this.props.users.length > 0 &&
                this.props.users.map(
                    user => (
                        <div className="wannabecontainer" key={user.id}>
                            <img className="wannabepic" src={user.img_url} />
                            <Link to={`/user/${user.id}`}><span><div className="wannabetext">{user.first} {user.last}</div></span></Link>
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
        users: state.onlineUsers
    };
};

export default connect(mapStateToProps)(OnlineUsers);
