import {DJNode, Neighbor, dijkstra, Path} from './Dijkstra';

function nodeHex(x: number, y: number): string {
    return `${(x).toString(16)}-${y.toString(16)}`;
}

export class RouteMap {
    graphMap: Map<string, DJNode>;

    fillNode(x: number, y: number) {
        const node: DJNode = this.graphMap.get(nodeHex(x, y));
        node.neighbors.forEach((neighbor: Neighbor) => {
            neighbor.node.neighbors = neighbor.node.neighbors.filter(
                (neighbor: Neighbor) => {
                    return neighbor.node != node;
                }
            );
        });
        (node.nodeExt as GridLocation).filled = true;
        node.neighbors = new Array<Neighbor>();
    }

    unfillNode(x: number, y: number) {
        const node: DJNode = this.graphMap.get(nodeHex(x, y));
        const location: GridLocation = node.nodeExt as GridLocation;
        location.filled = false;
        if (location.x > 0) {
            const neighborNode = this.graphMap.get(nodeHex(location.x - 1, location.y));
            if (!(neighborNode.nodeExt as GridLocation).filled) {
                node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
                neighborNode.neighbors = neighborNode.neighbors.concat(new Neighbor(node, 1))
            }
        }
    
        if (location.x < this.gridCount - 1) {
            const neighborNode = this.graphMap.get(nodeHex(location.x + 1, location.y));
            node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
            if (!(neighborNode.nodeExt as GridLocation).filled) {
                node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
                neighborNode.neighbors = neighborNode.neighbors.concat(new Neighbor(node, 1))
            }
        }
    
        if (location.y > 0) {
            const neighborNode = this.graphMap.get(nodeHex(location.x, location.y - 1));
            node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
            if (!(neighborNode.nodeExt as GridLocation).filled) {
                node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
                neighborNode.neighbors = neighborNode.neighbors.concat(new Neighbor(node, 1))
            }
        }
    
        if (location.y < this.gridCount - 1) {
            const neighborNode = this.graphMap.get(nodeHex(location.x, location.y + 1));
            node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
            if (!(neighborNode.nodeExt as GridLocation).filled) {
                node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
                neighborNode.neighbors = neighborNode.neighbors.concat(new Neighbor(node, 1))
            }
        }
    }


    calPath(x1: number, y1: number, x2: number, y2: number): Path {
        const nodeSource: DJNode = this.graphMap.get(nodeHex(x1, y1));
        
        const nodeDest: DJNode = this.graphMap.get(nodeHex(x2, y2));
        const paths: Array<Path> = dijkstra(Array.from(this.graphMap.values()), nodeSource);
        const path = paths.find(
            (path: Path): boolean => {
                return path.targetNode === nodeDest;
            }
        );
        return path;
    }

    initGraph(): void {
        this.graphMap = new Map<string, DJNode>();
        for (let x = 0; x < this.gridCount; x++) {
            for (let y = 0; y < this.gridCount; y++) {
                const node = new DJNode(`${x.toString(16)}-${y.toString(16)}`);
                node.nodeExt = new GridLocation(x, y);
                this.graphMap.set(node.nodeId, node);
            }
        }

        this.graphMap.forEach(
            (node: DJNode) => {
                const location: GridLocation = node.nodeExt as GridLocation;
                if (location.x > 0) {
                    const neighborNode = this.graphMap.get(nodeHex(location.x - 1, location.y));
                    node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
                }

                if (location.x < this.gridCount - 1) {
                    const neighborNode = this.graphMap.get(nodeHex(location.x + 1, location.y));
                    node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
                }

                if (location.y > 0) {
                    const neighborNode = this.graphMap.get(nodeHex(location.x, location.y - 1));
                    node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
                }

                if (location.y < this.gridCount - 1) {
                    const neighborNode = this.graphMap.get(nodeHex(location.x, location.y + 1));
                    node.neighbors = node.neighbors.concat(new Neighbor(neighborNode, 1));
                }
            }
        );
    }

    constructor(gridCount: number) {
        this.gridCount = gridCount;
        this.initGraph();
    }

    gridCount: number;
}

export class GridLocation {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.filled = false;
    }
    x: number;
    y: number;
    filled: boolean;
}
