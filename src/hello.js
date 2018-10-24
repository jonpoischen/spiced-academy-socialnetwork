import React from 'react';
import { Greetee, GreeteeEditor } from './greetee';

export default class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            greetee: 'Dolly'
        };
        this.changeGreetee = this.changeGreetee.bind(this);
        this.changeGreeteeToKitty = this.changeGreeteeToKitty.bind(this);
    }
    changeGreetee(e) {
        this.setState({
            greetee: e.target.value
        });
    }
    logProps() {
        console.log(
            this.props
        );
    }
    changeGreeteeToKitty() {
        this.setState({
            greetee: 'Kitty'
        });
    }
    render() {
        return (
            <div>
                <strong>
                    Hello, <Greetee name={this.state.greetee} />!
                </strong>
                <div>
                    <GreeteeEditor onChange={this.changeGreetee} />
                </div>
                <button onClick={this.changeGreeteeToKitty}>change to "kitty"</button>
            </div>
        );
    }
}
