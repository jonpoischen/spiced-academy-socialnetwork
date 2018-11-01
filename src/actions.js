import axios from 'axios';

export async function receiveFriendsAndWannabes() {
    const {data} = await axios.get('/api-friends');
    return {
        type: 'RECEIVE_FRIENDS_AND_WANNABES',
        friendsAndWannabes: data
    };
}

// need acceptFriendRequest function
export function acceptFriendRequest(id) {
    axios.post('/accept-friend-request', {
        receiver_id: id
    }).then(() => {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id: id
        };
    }).catch(err => console.log(err));
}

// need unfriend function
