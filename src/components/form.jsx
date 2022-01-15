import React, { Component } from 'react';
import './form.css';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            srow: this.props.srow,
            scol: this.props.scol,
            erow: this.props.erow,
            ecol: this.props.ecol,
        };
        this.changeSR = this.changeSR.bind(this);
        this.changeER = this.changeER.bind(this);
        this.changeSC = this.changeSC.bind(this);
        this.changeEC = this.changeEC.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const { srow, scol, erow, ecol } = this.state;
        this.props.changeSE(srow, scol, erow, ecol)
        event.preventDefault();
    }

    changeSR(event) {
        this.setState({ srow: event.target.value })
    }
    changeER(event) {
        this.setState({ erow: event.target.value })
    }
    changeSC(event) {
        this.setState({ scol: event.target.value })
    }
    changeEC(event) {
        this.setState({ ecol: event.target.value })
    }

    render() {
        const { srow, scol, erow, ecol } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="column">
                        <label>Starting Node Row:
                            <input type="number" value={this.state.srow} onChange={this.changeSR}></input>
                        </label>
                        <label>Ending Node Row:
                            <input type="number" value={this.state.erow} onChange={this.changeER}></input>
                        </label>
                    </div>
                    <div className="column">
                        <label>Starting Node Col:
                            <input type="number" value={this.state.scol} onChange={this.changeSC}></input>
                        </label>
                        <label>Ending Node Col:
                            <input type="number" value={this.state.ecol} onChange={this.changeEC}></input>
                        </label>
                    </div>
                </div>
                <input type="submit" value="Save Changes"></input>
            </form >
        );
    }
}

export default Form;