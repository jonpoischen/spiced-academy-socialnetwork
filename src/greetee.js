import React from 'react';

export function Greetee(props) {
    return <span>{props.name || 'World'}</span>
}

export function GreeteeEditor(props) {
    return <input onChange={props.onChange} />
}
