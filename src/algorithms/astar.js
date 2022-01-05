
export function astar(nodes, startNode, finishNode){
    const visitedNodesInOrder = [];
    if(!startNode||!finishNode||startNode===finishNode){
        return false;
    }
    startNode.distance = 0;
    const univistedNodes = getAllNodes(grid);
    while(!!univistedNodes.length){
        sortNodesByDistance(univistedNodes);
        const closestNode = univistedNodes.shift();
        if(closestNode.isWall) continue;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode)
        if(closestNode===finishNode){
            return visitedNodesInOrder;
        }
        updateUnivisitedNeighbours(closestNode,grid);
    }
}


function sortNodesByDistance(univistedNodes){
    univistedNodes.sort((nodeA,nodeB)=>nodeA.distance - nodeB.distance)
}

function updateUnivisitedNeighbours(node,grid){
    const univistedNeighbours = getUnivistedNeighbours(node,grid)
    for(const neighbour of univistedNeighbours){
        neighbour.distance = node.distance+1;
        neighbour.previousNode = node;
    }
}

function getUnivistedNeighbours(node, grid){
    const neighbours = [];
    const {col, row} = node;
    if(row>0) neighbours.push(grid[row-1][col])
    if(row<grid.length-1) neighbours.push(grid[row+1][col])
    if(col>0) neighbours.push(grid[row][col-1])
    if(col<grid[0].length-1) neighbours.push(grid[row][col+1])
    return neighbours.filter(neighbour => !neighbour.isVisited)
}

function getAllNodes(grid){
    const nodes = [];
    for(const row of grid){
        for(const node of row){
            nodes.push(node);
        }
    }
    return nodes;
}

export function shortestPath(finishNode){
    const shortestPath = [];
    let currentNode = finishNode;
    
    while(currentNode!==null){
        shortestPath.unshift(currentNode);
        currentNode=currentNode.previousNode;
    }
    
    return shortestPath
}