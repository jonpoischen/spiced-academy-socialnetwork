import * as io from 'socket.io-client';
import {onlineUsersList, userJoined, userLeft, savedMessages, newMessage} from './actions.js';

let socket;

export function initSocket(store) {
    if(!socket) {
        socket = io.connect();

        socket.on('onlineUsers', function(listOfUsers) {
            store.dispatch(onlineUsersList(listOfUsers));
        });

        socket.on('userJoined', (userWhoJoined) => {
            store.dispatch(userJoined(userWhoJoined));
        });

        socket.on('userLeft', (userWhoLeft) => {
            store.dispatch(userLeft(userWhoLeft));
        });

        socket.on('savedMessages', (messages) => {
            store.dispatch(savedMessages(messages));
        });

        socket.on('newMessage', (message) => {
            store.dispatch(newMessage(message));
        });
    }
    return socket;
}
