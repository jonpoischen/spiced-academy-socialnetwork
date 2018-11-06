import React from 'react';
import {connect} from 'react-redux';
import {initSocket} from './socket.js';

class Chat extends React.Component {
    constructor() {
        super();
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(e) {
        let socket = initSocket();

        if (e.which === 13) {
            let message = e.target.value;
            socket.emit('newMessage', message);
        }
    }

    componentDidUpdate() {
        console.log("this.chatContainer: ", this.chatContainer);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight - this.chatContainer.clientHeight;
    }

    render() {
        return (
            <div>
                <h1>Chat running!</h1>
                <div className="chatMessagesContainer" ref={elem => (this.chatContainer = elem)}></div>
                <textarea onKeyDown = {this.sendMessage}></textarea>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps)(Chat);
