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
        console.log(this.state);

        const formData = new FormData();
        formData.append('file', this.state.file);

        axios.post('/upload', formData)
            .then(() => {
                this.setState({image: formData.image, uploadStatus: true});
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return(
            <div className="container">
                <form onSubmit={this.handleUploadImage}>
                    <div className="formarea">
                        <input className="submitbutton" type="file" accept="image/*" onChange={this.handleChange} />
                    </div> type
                    <button className="submit">Upload</button>
                </form>
            </div>
        );
    }
}
