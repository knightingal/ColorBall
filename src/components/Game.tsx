import * as React from 'react';
import { RouteMap, GridLocation } from '../lib/Route';
import { randomNumber } from '../lib/Utils';

const DEBUG=false;

class BallInfo {
    constructor(id: number, gridX: number, gridY: number) {
        this.id = id;
        this.gridX = gridX;
        this.gridY = gridY;
        this.path = null;
        this.color = Colors[randomNumber(Colors.length)];
    }

    id: number;
    gridX: number;
    gridY: number;
    path: PathInfo;
    color: string;

    moveToNextNode() {
        if (this.path != null) {
            this.path.moveToNextNode();
        }
    }

    getCurrentPathX(): number {
        if (this.path != null) {
            return this.path.getCurrentX();
        } else {
            return null;
        }
    }

    getCurrentPathY(): number {
        if (this.path != null) {
            return this.path.getCurrentY();
        } else {
            return null;
        }
    }

    getCurrentPathDistance(): number {
        if (this.path != null) {
            return this.path.getCurrentDistance();
        } else {
            return null;
        }
    }
}

class NodeInfo {
    constructor(gridX: number, gridY: number, distance: number) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.distance = distance;
    }
    gridX: number;
    gridY: number;

    distance: number;
}

class PathInfo {
    constructor() {
        this.nodes = new Array<NodeInfo>();
        this.currentNode = -1;
    }
    nodes: Array<NodeInfo>;
    currentNode: number;

    moveToNextNode() {
        this.currentNode++;
    }

    getCurrentDistance(): number {
        if (this.currentNode < this.nodes.length) {
            return this.nodes[this.currentNode].distance;
        } else {
            return null;
        }
    }

    getCurrentX(): number {
        if (this.currentNode < this.nodes.length) {
            return this.nodes[this.currentNode].gridX;
        } else {
            return null;
        }
    }

    getCurrentY(): number {
        if (this.currentNode < this.nodes.length) {
            return this.nodes[this.currentNode].gridY;
        } else {
            return null;
        }
    }

    isPathOver() {
        return this.currentNode == this.nodes.length - 1;
    }
}


const BallNumberComponent = (props: {ballInfo: BallInfo}) => DEBUG ? <text 
            x={props.ballInfo.gridX * Game.GRID_SIZE + Game.OFFSET_TOP} 
            y={(props.ballInfo.gridY + 1) * Game.GRID_SIZE + Game.OFFSET_TOP}
            fill="black" 
        >{props.ballInfo.id}</text> 
        : null;


class BallComponent extends React.Component<{ballInfo: BallInfo, selected: boolean, game: Game},{}> {
    static margin: number = 3;
    constructor(props: {ballInfo: BallInfo, selected: boolean, game: Game}) {
        super(props);
        this.state = {};
    }

    handleTransitionEnd(e: React.TransitionEvent<SVGCircleElement>) {
        if (e.nativeEvent.propertyName == 'transform') {
            if (!this.props.ballInfo.path.isPathOver()) {
                this.props.ballInfo.moveToNextNode();
                this.setState({});
            } else {
                const newGridX = this.props.ballInfo.getCurrentPathX();
                const newGridY = this.props.ballInfo.getCurrentPathY();
                this.props.ballInfo.path = null;
                this.props.game.notifyBallMovedComplite(this.props.ballInfo, newGridX, newGridY);
            }
        }
    }

    render() {
        const style:React.CSSProperties = {};

        if (this.props.ballInfo.path != null && this.props.ballInfo.path.currentNode >= 0) {
            const offsetX = (this.props.ballInfo.getCurrentPathX() - this.props.ballInfo.gridX) * Game.GRID_SIZE;
            const offsetY = (this.props.ballInfo.getCurrentPathY() - this.props.ballInfo.gridY) * Game.GRID_SIZE;


            style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            style.transition = `all ${0.1 * this.props.ballInfo.getCurrentPathDistance()}s linear`;
        }

        if (!this.props.selected) {
            style.fill = this.props.ballInfo.color;
        }

        return <circle 
            className={this.props.selected ? "rect-ball-selected": null}
            style={style}
            cx={Game.OFFSET_TOP + (this.props.ballInfo.gridX + 0.5) * Game.GRID_SIZE} 
            cy={Game.OFFSET_TOP + (this.props.ballInfo.gridY + 0.5) * Game.GRID_SIZE} 
            r={(Game.GRID_SIZE - BallComponent.margin) / 2}
            onTransitionEnd={(e) => this.handleTransitionEnd(e)}
        /> 
        
    }

}

export class Game extends React.Component<{}, {balls: Array<BallInfo>, selectedBallId:number}> {
    static OFFSET_TOP = 3;
    static OFFSET_LEFT = 3;
    static GRID_SIZE = 30;
    static GRID_COUNT = 9;
    ballIdSeq = 1;

    routeMap: RouteMap;

    ballMatrix:Array<Array<number>> = [
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null]
    ];

    createHLine(index: number) {
        return <line 
            className="game-line" 
            key={index}
            x1={Game.OFFSET_LEFT} 
            y1={Game.GRID_SIZE * index + Game.OFFSET_TOP} 
            x2={Game.GRID_SIZE * Game.GRID_COUNT + Game.OFFSET_LEFT} 
            y2={Game.GRID_SIZE * index + Game.OFFSET_TOP}/>
    }

    createVLine(index:number) {
        return <line 
            className="game-line" 
            key={index}
            y1={Game.OFFSET_TOP} 
            x1={Game.GRID_SIZE * index + Game.OFFSET_LEFT} 
            y2={Game.GRID_SIZE * Game.GRID_COUNT + Game.OFFSET_TOP} 
            x2={Game.GRID_SIZE * index + Game.OFFSET_LEFT}/>
    }

    createHLines() {
        const ret = new Array<React.ReactNode>();
        for (let i: number = 0; i < Game.GRID_COUNT + 1; i++) {
            ret.push(this.createHLine(i));
        }
        return ret;
    }

    createVLines() {
        const ret = new Array<React.ReactNode>();
        for (let i: number = 0; i < Game.GRID_COUNT + 1; i++) {
            ret.push(this.createVLine(i));
        }
        return ret;
    }

    calPath(ballInfo:BallInfo, targetGridX: number, targetGridY: number): PathInfo {
        const pathInfo = new PathInfo();
        this.routeMap.unfillNode(ballInfo.gridX, ballInfo.gridY);
        const path = this.routeMap.calPath(ballInfo.gridX, ballInfo.gridY, targetGridX, targetGridY);
        if (path.distance === 999) {
            return null;
        }
        pathInfo.nodes = path.path.map(
            (djNode) => {
                return new NodeInfo((djNode.nodeExt as GridLocation).x, (djNode.nodeExt as GridLocation).y, 1);
            }
        );
        return pathInfo;
    }

    constructor(props: {}) {
        super(props);
        this.routeMap = new RouteMap(Game.GRID_COUNT);
        this.state = {balls: new Array<BallInfo>(), selectedBallId: null};
    }

    findBallById(id: number): BallInfo {
        const ret: Array<BallInfo> = this.state.balls.filter((ballInfo: BallInfo, index: number, array: BallInfo[]): boolean => {
            return ballInfo.id == id;
        });
        if (ret != null && ret.length != 0) {
            return ret[0];
        }
        return null;
    }

    handleClick(e: React.MouseEvent<HTMLDivElement>) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        if (x < Game.OFFSET_LEFT || y < Game.OFFSET_TOP || x > Game.GRID_COUNT * Game.GRID_SIZE || y > Game.GRID_COUNT * Game.GRID_SIZE) {
            return;
        }
        const gridX = Math.floor((x - Game.OFFSET_LEFT) / Game.GRID_SIZE);
        const gridY = Math.floor((y - Game.OFFSET_LEFT) / Game.GRID_SIZE);
        console.log(`touch column ${gridX}, line ${gridY}`);
        if (this.ballMatrix[gridX][gridY] != null) {
            // click a ball
            this.setState({selectedBallId: this.ballMatrix[gridX][gridY]})
        } else {
            // click empty grid
            if (this.state.selectedBallId == null) {
                // no selected ball
                this.ballMatrix[gridX][gridY] = this.ballIdSeq;
                this.routeMap.fillNode(gridX, gridY);
                this.setState({
                    balls:this.state.balls.concat(new BallInfo(this.ballIdSeq++, gridX, gridY)),
                    selectedBallId: null
                });
            } else {
                // select a ball, move to new grid
                const selectedBall:BallInfo = this.findBallById(this.state.selectedBallId);
                if (selectedBall != null) {
                    const path = this.calPath(selectedBall, gridX, gridY);
                    this.routeMap.fillNode(gridX, gridY);
                    selectedBall.path = path;
                    
                    selectedBall.moveToNextNode();
                    this.setState({
                        selectedBallId: null
                    });
                }
            }
        }
    }

    notifyBallMovedComplite(selectedBall: BallInfo, newGridX: number, newGridY: number) {
        this.ballMatrix[selectedBall.gridX][selectedBall.gridY] = null;
        selectedBall.gridX = newGridX;
        selectedBall.gridY = newGridY;
        this.ballMatrix[selectedBall.gridX][selectedBall.gridY] = selectedBall.id;

        const checkLineRet = this.checkLine(newGridX, newGridY);
        this.setState({
            selectedBallId: null
        });
    }

    checkLine(gridX: number, gridY: number): Array<number> {
        // return null;
        const currentColor = this.findBallById(this.ballMatrix[gridX][gridY]).color;
        let nextGridX: number;
        let nextGridY: number;
        const horizon = [this.ballMatrix[gridX][gridY]];
        nextGridX = gridX;
        nextGridY = gridY;
        while(true) {
            nextGridX++
            if (nextGridX < Game.GRID_COUNT && (this.ballMatrix[nextGridX][nextGridY] != null) && this.findBallById(this.ballMatrix[nextGridX][nextGridY]).color === currentColor) {
                horizon.push(this.ballMatrix[nextGridX][nextGridY]);
            } else {
                break;
            }
        }
        nextGridX = gridX;
        nextGridY = gridY;
        while(true) {
            nextGridX--
            if (nextGridX >= 0 && (this.ballMatrix[nextGridX][nextGridY] != null) && this.findBallById(this.ballMatrix[nextGridX][nextGridY]).color === currentColor) {
                horizon.push(this.ballMatrix[nextGridX][nextGridY]);
            } else {
                break;
            }
        }

        const vertical = [this.ballMatrix[gridX][gridY]];
        nextGridX = gridX;
        nextGridY = gridY;
        while(true) {
            nextGridY++
            if (nextGridY < Game.GRID_COUNT && (this.ballMatrix[nextGridX][nextGridY] != null) && this.findBallById(this.ballMatrix[nextGridX][nextGridY]).color === currentColor) {
                vertical.push(this.ballMatrix[nextGridX][nextGridY]);
            } else {
                break;
            }
        }
        nextGridX = gridX;
        nextGridY = gridY;
        while(true) {
            nextGridY--
            if (nextGridY >= 0 && (this.ballMatrix[nextGridX][nextGridY] != null) && this.findBallById(this.ballMatrix[nextGridX][nextGridY]).color === currentColor) {
                vertical.push(this.ballMatrix[nextGridX][nextGridY]);
            } else {
                break;
            }
        }

        
        const backslash = [this.ballMatrix[gridX][gridY]];
        nextGridX = gridX;
        nextGridY = gridY;
        while(true) {
            nextGridX++
            nextGridY++
            if (nextGridX < Game.GRID_COUNT && nextGridY < Game.GRID_COUNT && (this.ballMatrix[nextGridX][nextGridY] != null) && this.findBallById(this.ballMatrix[nextGridX][nextGridY]).color === currentColor) {
                backslash.push(this.ballMatrix[nextGridX][nextGridY]);
            } else {
                break;
            }
        }
        nextGridX = gridX;
        nextGridY = gridY;
        while(true) {
            nextGridX--
            nextGridY--
            if (nextGridX >= 0 && nextGridY >= 0 && (this.ballMatrix[nextGridX][nextGridY] != null) && this.findBallById(this.ballMatrix[nextGridX][nextGridY]).color === currentColor) {
                backslash.push(this.ballMatrix[nextGridX][nextGridY]);
            } else {
                break;
            }
        }

        const diagonal = [this.ballMatrix[gridX][gridY]];
        nextGridX = gridX;
        nextGridY = gridY;
        while(true) {
            nextGridX--
            nextGridY++
            if (nextGridX >= 0 && nextGridY < Game.GRID_COUNT && (this.ballMatrix[nextGridX][nextGridY] != null) && this.findBallById(this.ballMatrix[nextGridX][nextGridY]).color === currentColor) {
                diagonal.push(this.ballMatrix[nextGridX][nextGridY]);
            } else {
                break;
            }
        }
        nextGridX = gridX;
        nextGridY = gridY;
        while(true) {
            nextGridX++
            nextGridY--
            if (nextGridX < Game.GRID_COUNT && nextGridY >= 0 && (this.ballMatrix[nextGridX][nextGridY] != null) && this.findBallById(this.ballMatrix[nextGridX][nextGridY]).color === currentColor) {
                diagonal.push(this.ballMatrix[nextGridX][nextGridY]);
            } else {
                break;
            }
        }

        let ret = new Array<number>();
        if (horizon.length >= 5) {
            console.log(`a horizon made up, ${horizon}`)
            ret = ret.concat(horizon);
        }
        if (vertical.length >= 5) {
            console.log(`a vertical made up, ${vertical}`)
            ret = ret.concat(vertical);
        }
        if (backslash.length >= 5) {
            console.log(`a backslash made up, ${backslash}`)
            ret = ret.concat(backslash);
        }
        if (diagonal.length >= 5) {
            console.log(`a diagonal made up, ${diagonal}`)
            ret = ret.concat(diagonal);
        }

        return ret;
    }

    render() {
        let ballComponents = this.state.balls.map((ball)=>{
            const selected: boolean = ball.id == this.state.selectedBallId;
            return <BallComponent key={ball.id} ballInfo={ball} selected={selected} game={this}/>;
        });
        let ballNumberComponents = this.state.balls.map((ball) => {
            return <BallNumberComponent key={ball.id} ballInfo={ball} />
        });
        return (
            <div>
            <svg className="game-svg" width="1000px" height="1000px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                {this.createHLines()}        
                {this.createVLines()}        
                {ballComponents}
                {ballNumberComponents}
            </svg>
            <div className="touch-layer" onClick={(e)=>this.handleClick(e)}></div>
            </div>
        )
    }
}

const Colors = [
    "blue",
    "red",
    "yellow",
    "lime",
];