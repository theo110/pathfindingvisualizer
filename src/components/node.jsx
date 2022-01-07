import React, { Component } from 'react'
import './node.css'

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { isStart, isFinish, Animate, isPath, onMouseDown, onMouseUp, isWall, row, col} = this.props;
        const Name = isWall ? 'Wall' : isPath ? 'Path' : isFinish ? 'Finish' : isStart ? 'Start' : Animate ? 'Animate' : 'Node';
        return <div
            className={Name}
            onMouseDown ={() => onMouseDown(row, col)}
            onMouseUp = {() => onMouseUp()}
        ></div>
    }
}

export const DEFAULT = {
    col: 0,
    row: 0,
}