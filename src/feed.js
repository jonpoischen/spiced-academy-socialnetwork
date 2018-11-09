import React from 'react';
import axios from './axios.js';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {receiveFeedPosts} from './actions.js';

class Feed extends React.Component {
    constructor() {
        super();
        this.state = {
            inputValue: '',
            error: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.sendMessageByButton = this.sendMessageByButton.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(receiveFeedPosts());
    }

    handleChange(evt) {
        this.setState({ "file": evt.target.files[0] });
    }

    updateInputValue(e) {
        this.setState({
            inputValue: e.target.value,
            error: false,
        });
    }

    sendMessage(e) {
        if (!this.state.inputValue && !this.state.file) {
            this.setState({error: true});
        } else if (e.which === 13) {
            this.sendMessageByButton();
        }
    }

    sendMessageByButton() {
        if (!this.state.inputValue && !this.state.file) {
            this.setState({error: true});
            return;
        }

        let data;
        if (!this.state.file) {
            data = {
                text: this.state.inputValue
            };
        } else {
            data = new FormData;
            data.append('text', this.state.inputValue);
            data.append('file', this.state.file);
        }

        axios.post('/feed', data)
            .then(() => {
                console.log("reload the feed");
                location.reload();
            })
            .catch(err => {console.log(err);});
    }

    render() {
        const { posts } = this.props;

        if (!posts) {
            return (
                <div>
                    <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} className="chatInput" onKeyDown={this.sendMessage} autoFocus={true} placeholder="What's on your mind?"></input><br />
                    <input className="submitbutton" type="file" accept="image/*" onChange={this.handleChange} />
                    <div><button className="chatSendButton" onClick={this.sendMessageByButton}>Share</button></div>
                </div>
            );
        }

        return (
            <div className="formcontainer">
                <div className="newPostContainer">
                    <div className="makepostbox"><span><img className="makepostpen" src="/pen.png" /><h4 className="makeposttext">Make Post</h4></span></div>
                    <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} className="postInput" onKeyDown={this.sendMessage} autoFocus={true} placeholder=" What's on your mind?"></input><br />

                    <div className='imageupload'>
                        <label htmlFor="fileinput">
                            <img src="/uploadphotobutton.png"/>
                        </label>
                        <input id="fileinput" type="file" accept="image/*" onChange={this.handleChange} />
                    </div>

                    <div><button className="sharepostbutton" onClick={this.sendMessageByButton}>Share</button></div>
                </div>

                <div className="postsContainer" ref={elem => (this.chatContainer = elem)}>
                    <div>
                        {this.props.posts && this.props.posts.map(
                            (post, index) => {
                                return (
                                    <div key={index}>
                                        <div><img className="postpic" src={post.img_url} /></div>
                                        <Link to={`/user/${post.id}`}><span><div className="postusername">{post.first} {post.last}</div></span></Link>
                                        <p className="posttime">{post.created_at}</p>
                                        <div className="postmessagetext">{post.message}</div>
                                        <img className="postuploadedpic" src={post.feedpic} />
                                        <br /><br /><br />
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        posts: state.posts
    };
};

export default connect(mapStateToProps)(Feed);
