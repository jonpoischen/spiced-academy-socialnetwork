export default function reducer(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDS_AND_WANNABES') {
        state = {
            ...state,
            friendsAndWannabes: action.data
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
    return state;
}
