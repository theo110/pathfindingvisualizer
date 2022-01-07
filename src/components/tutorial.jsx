import React, { Component } from 'react';
import './tutorial.css';

class Tutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let dialog = (
            <div className='box'>
                <button className='close' onClick={this.props.onClose}>x</button>
                <div>{this.props.children}</div>
            </div>
        );
        if (!this.props.isOpen) {
            dialog = null;
        }
        return (
            <div>
                {dialog}
            </div>
        );
    }
}

export default Tutorial;