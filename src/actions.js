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

export function onlineUsersList(users) {
    return {
        type: 'ONLINE_USERS',
        users
    };
}

export function userJoined(userJoined) {
    return {
        type: 'USER_JOINED',
        userJoined
    };
}

export function userLeft(userLeft) {
    return {
        type: 'USER_LEFT',
        userLeft
    };
}

export function savedMessages(messages) {
    return {
        type: 'SAVED_MESSAGES',
        messages
    };
}

export function newMessage(message) {
    return {
        type: 'NEW_MESSAGE',
        message
    };
}
