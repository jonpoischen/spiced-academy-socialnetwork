import React from 'react';
import axios from './axios.js';

export default class Opp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const oppId = this.props.match.params.id;
        axios.get('/api-user/' + oppId).then(results => {
            if (results.data.success) {
                this.props.history.push('/profile');
            } else {
                this.setState({...results.data[0]});
            }
        });
    }

    render() {
        return (
            <div className="profile formcontainer">
                <img className="coverphoto" src="/fakebook_cover.jpeg" />
                <p className="profilename">{this.state.first} {this.state.last}</p>
                <img className="bigusericon" src={this.state.img_url} />
                <div className="streamflex">
                    <div className="leftstream">
                        <p>{this.state.bio}</p>
                    </div>
                    <div className="rightstream">
                        <p>Hi</p>
                    </div>
                </div>
            </div>
        );
    }
}
