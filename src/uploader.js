import React from 'react';
import axios from './axios.js';

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadStatus: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleUploadImage = this.handleUploadImage.bind(this);
    }
    handleChange(evt) {
        this.setState({ "file": evt.target.files[0] });
    }
    handleUploadImage(evt) {
        evt.preventDefault();

        const formData = new FormData();
        formData.append('file', this.state.file);

        axios.post('/upload', formData)
            .then(data => {
                this.props.setImage(data.data[0].img_url);
            })
            .catch(err => {
                console.log(err);
            });
    }
    render() {
        return(
            <div className="formarea">
                <form onSubmit={this.handleUploadImage}>
                    <div className="formarea">
                        <input className="submitbutton" type="file" accept="image/*" onChange={this.handleChange} />
                    </div>
                    <button className="submitbutton">Upload</button>
                </form>
            </div>
        );
    }
}
