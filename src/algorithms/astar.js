export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    var openList = [];
    openList.push(startNode);

    while (openList.length > 0) {
        var lowestI = 0;
        for (var i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[lowestI].f){
                lowestI = i;
            }
        }
        var currentNode = openList.splice(lowestI,1)[0];
        visitedNodesInOrder.push(currentNode)
        if (currentNode === finishNode) {
            return visitedNodesInOrder;
        }
        currentNode.closed = true;

        var neighbors = getNeighbours(currentNode,grid);
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (neighbor.closed || neighbor.isWall) {
                continue;
            }

            var gScore = currentNode.g + 1; 
            var gScoreIsBest = false;
            var bestNode = null;

            if (!neighbor.isVisited) {
                gScoreIsBest = true;
                neighbor.h = getH(neighbor, finishNode);
                neighbor.isVisited = true;
                openList.push(neighbor);
            }
            else if (gScore < neighbor.g) {
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                bestNode = neighbor
                neighbor.previousNode = currentNode;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.debug = "F: " + neighbor.f + "<br />G: " + neighbor.g + "<br />H: " + neighbor.h;
            }
        }
    }
    return false;
}

function getH(node, finishNode) {
    return Math.abs(node.col - finishNode.col) + Math.abs(node.row - finishNode.row);
}

function getNeighbours(node, grid) {
    const neighbours = [];
    const { col, row } = node;
    if (row > 0) neighbours.push(grid[row - 1][col])
    if (row < grid.length - 1) neighbours.push(grid[row + 1][col])
    if (col > 0) neighbours.push(grid[row][col - 1])
    if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1])
    return neighbours
}