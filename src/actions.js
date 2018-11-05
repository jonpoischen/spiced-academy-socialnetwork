import axios from './axios.js';

export async function receiveFriendsAndWannabes() {
    const {data} = await axios.get('/api-friends');
    return {
        type: 'RECEIVE_FRIENDS_AND_WANNABES',
        data
    };
}

export async function acceptFriendRequest(id) {
    await axios.post('/accept-friend-request', {receiver_id: id});
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id
    };
}

export async function endFriendship(id) {
    await axios.post('/end-friendship', {receiver_id: id});
    return {
        type: "UNFRIEND",
        id
    };
}


export function onlineUsers(onlineUsersList) {
    console.log("onlineUsers action fired!", onlineUsersList);
}

export function userJoined(userJoined) {
    console.log("userJoined fired!", userJoined);
}

export function userLeft(userLeft) {
    console.log("userLeft fired!", userLeft);
}
