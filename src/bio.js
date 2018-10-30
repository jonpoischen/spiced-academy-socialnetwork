import React from 'react';
import axios from './axios';

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editBio: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleBioSave = this.handleBioSave.bind(this);
        this.showBio = this.showBio.bind(this);
    }
    handleBioSave(bio) {
        bio.preventDefault();

        axios.post('/bio', this.state)
            .then(() => {
                this.setState({
                    editBio: false
                });
                this.props.setBio(this.state.bio);
            })
            .catch(err => {
                console.log(err);
            });
    }
    handleChange(evt) {
        this.setState({ bio: evt.target.value });
    }
    showBio() {
        if (this.state.editBio === true) {
            this.setState({
                editBio: false
            });
        } else {
            this.setState({
                editBio: true
            });
        }
    }
    render() {
        if(this.state.editBio == true) {
            return (
                <div>
                    <textarea className="biotextarea" defaultValue={this.props.bio} onChange={this.handleChange}></textarea>
                    <br />
                    <button className="savebiobutton" onClick={this.handleBioSave}>Save</button>
                </div>
            );
        } else {
            return (
                <div>
                    <p className="biotext">{this.props.bio}</p>
                    <button className="editbiobutton" onClick={this.showBio}>Edit</button>
                </div>
            );
        }
    }

}
