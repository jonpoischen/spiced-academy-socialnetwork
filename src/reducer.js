export default function reducer(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDS_AND_WANNABES') {
        state = {
            ...state,
            friendsAndWannabes: action.friendsAndWannabes
        };
    }
    if (action.type == 'ACCEPT_FRIEND_REQUEST') {
        // accept the friend request
    }
    if (action.type == 'UNFRIEND') {
        // unfriend someone
    }
    return state;
}
