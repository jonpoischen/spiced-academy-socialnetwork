Socket Events
All of these events will be EMITTED from the server.

1. onlineUsers
    - emits an array of everyone who's online to the client
    - once client has it, put that list of users in Redux
    - socket.emit() emits an event to the person who just
    connected
2. userJoined
    - emits an object containing the data of the user that just joined
    to the client
    - client will add this object to the online users array in Redux
    created in step 1
    - socket.broadcast.emit() emits an event to everyone except someone
    who just connected
    - only broadcast this event if the user who just logged on
    only appears once in the onlineUsers list
3. userLeft
    - emits userID of user who just disconnected or logged out and emit
    that to the client
    - client will take the userId of the user who just left out and
    will remove that user's object from Redux
    - io.sockets.emit() emits message to every single connected socket
