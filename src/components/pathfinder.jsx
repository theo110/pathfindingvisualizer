import React, { Component } from 'react';
import Node from './node';
import PopUp from './popup';
import Form from './form'
import './pathfinder.css';
import { dijkstra, shortestPath } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/astar';
import classnames from 'classnames';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NUM_COLS = 30;
const NUM_ROWS = 15;

export default class Pathfinder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            mouseIsPressed: false,
            openBox: true,
            changeStartEnd: false,
            algorithm: 2,
            distance: "",
            srow: 5,
            scol: 5,
            erow: 5,
            ecol: 25,
            action: false,
        };
        this.changeSE = this.changeSE.bind(this)
    }

    componentDidMount() {
        this.clearBoard()
    }

    handleMouseDown(row, col) {
        if (this.state.action) return
        const newGrid = changeWall(this.state.nodes, row, col)
        this.setState({ nodes: newGrid, mouseIsPressed: true });
    }

    handleMouseUp() {
        if (this.state.action) return
        this.setState({ mouseIsPressed: false })
    }

    clearBoard() {
        const nodes = this.getInitialGrid()
        this.setState({ nodes: nodes, distance: "" })
    }

    changeSE(sr, sc, er, ec) {
        this.setState({
            srow: sr,
            scol: sc,
            erow: er,
            ecol: ec,
        }, () => {
            this.reset();
        })
    }

    getInitialGrid = () => {
        const nodes = [];
        for (let row = 0; row < NUM_ROWS; row++) {
            const currentRow = [];
            for (let col = 0; col < NUM_COLS; col++) {
                currentRow.push(this.createNode(col, row))
            }
            nodes.push(currentRow)
        }
        return nodes;
    }

    createNode = (col, row) => {
        const { srow, scol, erow, ecol } = this.state
        return {
            col,
            row,
            isStart: row == srow && col == scol,
            isFinish: row == erow && col == ecol,
            closed: false,
            isVisited: false,
            Animate: false,
            isPath: false,
            distance: Infinity,
            f: 0,
            g: 0,
            h: 0,
            debug: "",
            isWall: false,
            previousNode: null,
        }
    }

    reset() {
        const { nodes, srow, scol, erow, ecol } = this.state
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                const node = nodes[row][col];
                const newNode = {
                    ...node,
                    isStart: row == srow && col == scol,
                    isFinish: row == erow && col == ecol,
                    closed: false,
                    isVisited: false,
                    Animate: false,
                    isPath: false,
                    distance: Infinity,
                    f: 0,
                    g: 0,
                    h: 0,
                    debug: "",
                    previousNode: null,
                };
                nodes[row][col] = newNode
            }
        }
        this.setState({ nodes: nodes, distance: "" })
    }

    animatePath(shortestPath) {
        for (let i = 1; i < shortestPath.length - 1; i++) {
            setTimeout(() => {
                const node = shortestPath[i];
                const newGrid = this.state.nodes.slice();
                const newNode = {
                    ...node,
                    isPath: true,
                };
                newGrid[node.row][node.col] = newNode;
                this.setState({ nodes: newGrid });
                if (i === shortestPath.length - 2) {
                    const d = String(i + 1) + " units."
                    this.setState({ distance: d, action: false})
                }
            }, 30 * i)
        }
    }

    visualizeShortestPath(finishNode) {
        const path = shortestPath(finishNode);
        this.animatePath(path)
    }

    animate(visitedNodesInOrder) {
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const newGrid = this.state.nodes.slice();
                const newNode = {
                    ...node,
                    Animate: true,
                };
                newGrid[node.row][node.col] = newNode;
                this.setState({ nodes: newGrid });
                if (i === visitedNodesInOrder.length - 1) {
                    this.visualizeShortestPath(visitedNodesInOrder[i])
                }
            }, 30 * i);
        }
    }

    visualize() {
        const { nodes, algorithm } = this.state
        const startNode = nodes[this.state.srow][this.state.scol];
        const finishNode = nodes[this.state.erow][this.state.ecol];
        switch (algorithm) {
            case 1:
                var visitedNodesInOrder = dijkstra(nodes, startNode, finishNode)
                break;
            case 2:
                var visitedNodesInOrder = aStar(nodes, startNode, finishNode)
                break;
        }
        this.animate(visitedNodesInOrder)
    }

    render() {
        const { nodes } = this.state;
        return (
            <>
                <div class="tutorialbox">
                    <PopUp isOpen={this.state.openBox} onClose={(e) => this.setState({ openBox: false })}>
                        <div className='tutorial tutorialhead'>Welcome to my Pathfinding Visualizer</div>
                        <div className='tutorial tutorialtext'>Here is a brief tutorial:</div>
                        <ul className='tutorial tutoriallist'>
                            <li>The yellow square is the start and the green square is the end</li>
                            <li>Click anywhere on the grid to add/remove walls</li>
                            <li>To visualize an algorithm, you must first select the algorithm with the dropdown button</li>
                            <li>Have fun!</li>
                        </ul>
                    </PopUp>
                    <PopUp isOpen={this.state.changeStartEnd} onClose={(e) => this.setState({ changeStartEnd: false })}>
                        <Form
                            srow={this.state.srow}
                            scol={this.state.scol}
                            erow={this.state.erow}
                            ecol={this.state.ecol}
                            changeSE={this.changeSE}
                        ></Form>
                    </PopUp>
                </div>
                <div class="header">
                    <div class="title">A Simple Pathfinding Visualizer</div>
                    <div class="settings">
                        <Dropdown className="d-inline mx-2">
                            <Dropdown.Toggle id="dropdown-autoclose-true">
                                Algorithms
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => {
                                    this.setState({ algorithm: 1 })
                                }}>Dijkstra</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    this.setState({ algorithm: 2 })
                                }}>A*</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <button className={classnames('button1', { 'disabled': this.state.action, 'enabled': !this.state.action })} onClick={() => {
                            if (this.state.action === false) {
                                this.visualize()
                            }
                            this.setState({action:true})
                        }}>Visualize</button>
                        <button className={classnames('button1', { 'disabled': this.state.action, 'enabled': !this.state.action })} onClick={() => {
                            if (this.state.action === false) {
                                this.reset()
                            }
                        }}>Reset</button>
                        <button className={classnames('button1', { 'disabled': this.state.action, 'enabled': !this.state.action })} onClick={() => {
                            if (this.state.action === false) {
                                this.clearBoard()
                            }
                        }}>Clear Board</button>
                        <button className={classnames('button1', { 'disabled': this.state.action, 'enabled': !this.state.action })} onClick={() => {
                            if (this.state.action === false) {
                                this.setState({ changeStartEnd: true })
                            }
                        }}>Change start/end</button>
                    </div>
                    <div className="distance">The path distance is: {this.state.distance}</div>
                </div>
                <div className="board">
                    {
                        nodes.map((row, rowI) => {
                            return (
                                <div key={rowI}>
                                    {row.map((node, nodeI) => {
                                        const { row, col, isStart, isFinish, Animate, isPath, isWall } = node;
                                        return (
                                            <Node
                                                key={nodeI}
                                                row={row}
                                                col={col}
                                                isStart={isStart}
                                                isFinish={isFinish}
                                                Animate={Animate}
                                                isPath={isPath}
                                                isWall={isWall}
                                                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                                onMouseUp={() => this.handleMouseUp()}
                                            ></Node>
                                        );
                                    })}
                                </div>
                            );
                        })}
                </div>
            </>
        );
    }
}

const changeWall = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col]
    const newNode = {
        ...node,
        isWall: !node.isWall
    };
    newGrid[row][col] = newNode;
    return newGrid;
}