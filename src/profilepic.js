import React from 'react';

export function ProfilePic(props) {
    if(!props.id) {
        return null;
    }
    const image = props.image || '/default.jpg';
    return (
        <img onClick={props.clickHandler} src={image} />
    );
}
