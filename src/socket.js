import * as io from 'socket.io-client';
import {onlineUsersList, userJoined, userLeft} from './actions.js';

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

        socket.on('newMessage', (newMessage) => {
            console.log("new message in FRONT: ", newMessage);
        });
    }
    return socket;
}
