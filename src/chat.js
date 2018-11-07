import React from 'react';
import {connect} from 'react-redux';
import {initSocket} from './socket.js';
import { Link } from 'react-router-dom';

class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            inputValue: '',
            error: false
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.sendMessageByButton = this.sendMessageByButton.bind(this);
    }

    // componentDidMount() {
    //     document.getElementsByClassName('chatInput')[0].focus();
    // }

    updateInputValue(e) {
        this.setState({
            inputValue: e.target.value,
            error: false
        });
    }

    sendMessage(e) {
        let socket = initSocket();

        if (!this.state.inputValue) {
            this.setState({error: true});
        } else if (e.which === 13) {
            let message = this.state.inputValue;
            socket.emit('newMessage', message);
            this.setState({
                inputValue: ""
            });
        }
    }

    sendMessageByButton() {
        if (!this.state.inputValue) {
            this.setState({error: true});
            return;
        }

        let socket = initSocket();
        let message = this.state.inputValue;
        socket.emit('newMessage', message);
        this.setState({
            inputValue: ""
        });
        document.getElementsByClassName('chatInput')[0].focus();
    }

    componentDidUpdate() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight - this.chatContainer.clientHeight;
    }

    render() {
        const { savedMessages } = this.props;

        if (!savedMessages) {
            return (
                <div>
                    <h1>Messenger</h1>
                    <div className="chatContainer" ref={elem => (this.chatContainer = elem)}></div>
                    <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} className="chatInput" onKeyDown={this.sendMessage}></input>
                    <div><button className="chatSendButton" onClick={this.sendMessageByButton}>Send</button></div>
                </div>
            );
        }

        return (
            <div>
                <h1>Messenger</h1>
                <div className="chatContainer" ref={elem => (this.chatContainer = elem)}>
                    <div>
                        {this.props.savedMessages.map(
                            (message, index) => (
                                <div key={index}>
                                    <div><img className="chatpic" src={message.img_url} /></div>
                                    <Link to={`/user/${message.id}`}><span><div className="chatusername">{message.first} {message.last}</div></span></Link>
                                    <div className="chatmessagetext">{message.message} <p className="chattimestamp">{message.msg_created}</p></div>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} className="chatInput" onKeyDown={this.sendMessage} autoFocus={true}></input>
                <div><button className="chatSendButton" onClick={this.sendMessageByButton}>Send</button></div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        savedMessages: state.savedMessages
    };
};

export default connect(mapStateToProps)(Chat);
