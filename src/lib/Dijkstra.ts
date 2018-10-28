export class DJNode {
    constructor(nodeId: string) {
        this.nodeId = nodeId;
        this.neighbors = [];
        this.nodeExt = null;

    }
    nodeId: string;
    neighbors: Array<Neighbor>;
    nodeExt: any;
}

export class Neighbor {
    constructor(node: DJNode, weight: number) {
        this.node = node;
        this.weight = weight;
    }
    node: DJNode;
    weight: number;
}

export class Path {
    constructor(targetNode: DJNode, path: Array<DJNode>, distance: number) {
        this.targetNode = targetNode;
        this.path = path;
        this.distance = distance;
    }

    targetNode: DJNode;
    path: Array<DJNode>;
    distance: number;
}

export function dijkstra(
    graph: Array<DJNode>, vNode: DJNode
): Array<Path> {
    let sList = Array<Path>();

    sList = sList.concat(new Path(vNode, new Array<DJNode>(), 0));

    const uList: Array<Path> = graph.filter(
        (node: DJNode) => {
            return node != vNode;
        }
    ).map(
        (node: DJNode)=>{
            let distance = 999;

            let path: Array<DJNode> = null;
            const vNeighbor: Array<Neighbor> = node.neighbors.filter(
                (neighbor: Neighbor, index: number, array: Array<Neighbor>) => {
                    return neighbor.node === vNode;
                }
            );

            if (vNeighbor != null && vNeighbor.length != 0) {
                distance = vNeighbor[0].weight;
                path = [node];
            }
            return new Path(node, path, distance);
        }
    );

    while (uList.length > 0) {
        uList.sort((a: Path, b: Path): number => {
            return a.distance - b.distance;
        });

        const u = uList.shift();
        const uNode = u.targetNode;
        sList = sList.concat(u);
        uNode.neighbors.forEach((uNeighbor: Neighbor) => {
            uList.forEach((restUPath: Path) => {
                if (
                    restUPath.targetNode === uNeighbor.node 
                    && uNeighbor.weight + u.distance < restUPath.distance
                ) {
                    restUPath.distance = uNeighbor.weight + u.distance;
                    u.path.copyWithin(0, 0);
                    restUPath.path = u.path.map((value: DJNode) => {return value});
                    restUPath.path = restUPath.path.concat(restUPath.targetNode);
                }
            });
        });
    }


    return sList;
}