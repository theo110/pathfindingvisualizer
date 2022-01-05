import React, { Component } from 'react';
import Node from './node/node';
import './pathfinder.css';
import { dijkstra, shortestPath } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/astar';
import classnames from 'classnames'

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

    render() {
        const { nodes } = this.state;
        return (
            <>
                <div class="header">
                    <h1>A Simple Pathfinding Visualizer</h1>
                    <button className={classnames('button1', { 'disabled': action, 'enabled': !action })} onClick={() => {
                        if (action === false) {
                            this.visualizeDijkstra()
                        }
                        action = true
                    }}>Dijkstra</button>
                    <button className={classnames('button1', { 'disabled': action, 'enabled': !action })} onClick={() => {
                        if (action === false) {
                            this.visualizeAStar()
                        }
                        action = true
                    }}>A*</button>
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