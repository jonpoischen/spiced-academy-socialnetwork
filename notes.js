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

=================================

2 Data Flows of Chat

1. chatMessages
   - start in the server
   - in server, build list of 10 most recent chat messages and emit them to front-end sockets
     - you have 2 options for storing chat messages:
       1. in an array in the server
       2. in a new table in your database
   - front-end sockets should dispatch and put the chats in Redux.
   - the chat component should render those chats

2. chatMessage or singleChatMessage or newMessage
   - starts in chat.js
   - when user posts a new chat message, emit an event called chatMessage, singleChatMessage, or newMessage to the back
   - in the server listen for that event
   - when server hears event, store the new message (along with info about the poster) in an array or table (whichever you prefer)
   - server should emit an event to the front that contains as its payload info about the poster + the new message
   - once the front has this package / object, dispatch and put that in Redux
