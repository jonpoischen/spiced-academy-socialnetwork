export default function reducer(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDS_AND_WANNABES') {
        state = {
            ...state,
            friendsAndWannabes: action.data
        };
    }
    if (action.type == 'RECEIVE_FEED_POSTS') {
        console.log("reducer: ", action.data);
        state = {
            ...state,
            posts: action.data
        };
    }
    if (action.type == 'ACCEPT_FRIEND_REQUEST') {
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map(
                friend => {
                    if (friend.id == action.id) {
                        return {
                            ...friend,
                            accepted: true
                        };
                    } else {
                        return friend;
                    }
                }
            )
        };
    }
    if (action.type == 'UNFRIEND') {
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.filter(
                friend => (friend.id != action.id)
            )
        };
    }
    if (action.type == 'ONLINE_USERS') {
        state = {
            ...state,
            onlineUsers: action.users
        };
    }
    if (action.type == 'USER_JOINED') {
        state = {
            ...state,
            onlineUsers: [...state.onlineUsers, action.userJoined[0]]
        };
    }
    if (action.type == 'USER_LEFT') {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(user => {
                if (user.id !== action.userLeft) {
                    return user;
                }
            })
        };
    }
    if (action.type == 'SAVED_MESSAGES') {
        state = {
            ...state,
            savedMessages: action.messages
        };
    }
    if (action.type == 'NEW_MESSAGE') {
        state = {
            ...state,
            savedMessages: [...state.savedMessages, action.message]
        };
    }
    return state;
}
