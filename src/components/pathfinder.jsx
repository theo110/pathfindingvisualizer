import React, { Component } from 'react';
import Node from './node';
import Tutorial from './tutorial';
import './pathfinder.css';
import { dijkstra, shortestPath } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/astar';
import classnames from 'classnames';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NUM_COLS = 30;
const NUM_ROWS = 15;
const START_COLS = 5;
const START_ROWS = 10;
const END_COLS = 25;
const END_ROWS = 5;

//track if program is animating
let action = false;

export default class Pathfinder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            mouseIsPressed: false,
            openBox: true,
            algorithm: 0,
        };
    }

    componentDidMount() {
        this.clearBoard()
    }

    handleMouseDown(row, col) {
        if (action) return
        const newGrid = changeWall(this.state.nodes, row, col)
        this.setState({ nodes: newGrid, mouseIsPressed: true });
    }

    handleMouseUp() {
        if (action) return
        this.setState({ mouseIsPressed: false })
    }

    clearBoard() {
        const nodes = getInitialGrid()
        this.setState({ nodes })
    }

    reset() {
        const { nodes } = this.state
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                const node = nodes[row][col];
                const newNode = {
                    ...node,
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
        this.setState({ nodes })

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
                    action = false;
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

    visualizeDijkstra() {
        const { nodes } = this.state
        const startNode = nodes[START_ROWS][START_COLS];
        const finishNode = nodes[END_ROWS][END_COLS];
        const visitedNodesInOrder = dijkstra(nodes, startNode, finishNode)
        this.animate(visitedNodesInOrder)
    }

    visualizeAStar() {
        const { nodes } = this.state
        const startNode = nodes[START_ROWS][START_COLS];
        const finishNode = nodes[END_ROWS][END_COLS];
        const visitedNodesInOrder = aStar(nodes, startNode, finishNode)
        this.animate(visitedNodesInOrder)
    }

    visualize() {
        const { nodes, algorithm } = this.state
        const startNode = nodes[START_ROWS][START_COLS];
        const finishNode = nodes[END_ROWS][END_COLS];
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
                    <Tutorial isOpen={this.state.openBox} onClose={(e) => this.setState({ openBox: false })}>
                        <div className='tutorial tutorialhead'>Welcome to my Pathfinding Visualizer</div>
                        <div className='tutorial tutorialtext'>Here is a brief tutorial:</div>
                        <ul class='tutorial tutoriallist'>
                            <li>The yellow square is the start and the green square is the end</li>
                            <li>Click anywhere on the grid to add/remove walls</li>
                            <li>To visualize an algorithm, you must first select the algorithm with the dropdown button</li>
                            <li>Have fun!</li>
                        </ul>
                    </Tutorial>
                </div>
                <div class="header">
                    <h1>A Simple Pathfinding Visualizer</h1>
                    <Dropdown className="d-inline mx-2">
                        <Dropdown.Toggle id="dropdown-autoclose-true">
                            Algorithms
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => {
                                this.state.algorithm = 1;
                            }}>Dijkstra</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                this.state.algorithm = 2;
                            }}>A*</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <button className={classnames('button1', { 'disabled': action, 'enabled': !action })} onClick={() => {
                        if (action === false) {
                            this.visualize()
                        }
                        action = true
                    }}>Visualize</button>
                    <button className={classnames('button1', { 'disabled': action, 'enabled': !action })} onClick={() => {
                        if (action === false) {
                            this.reset()
                        }
                    }}>Reset</button>
                    <button className={classnames('button1', { 'disabled': action, 'enabled': !action })} onClick={() => {
                        if (action === false) {
                            this.clearBoard()
                        }
                    }}>Clear Board</button>
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

const getInitialGrid = () => {
    const nodes = [];
    for (let row = 0; row < NUM_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < NUM_COLS; col++) {
            currentRow.push(createNode(col, row))
        }
        nodes.push(currentRow)
    }
    return nodes;
}

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_ROWS && col === START_COLS,
        isFinish: row === END_ROWS && col === END_COLS,
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