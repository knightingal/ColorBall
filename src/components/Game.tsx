import * as React from 'react';
interface BallInfo {
    id: number;
    gridX: number;
    gridY: number;
}
class BallComponent extends React.Component<{ballInfo: BallInfo},{}> {
    static margin: number = 3;
    constructor(props: {ballInfo: BallInfo}) {
        super(props);
    }

    render() {
        return <rect 
            className="rect-ball"
            x={Game.OFFSET_TOP + this.props.ballInfo.gridX * Game.GRID_SIZE + BallComponent.margin} 
            y={Game.OFFSET_TOP + this.props.ballInfo.gridY * Game.GRID_SIZE + BallComponent.margin} 
            width={Game.GRID_SIZE - BallComponent.margin * 2}
            height={Game.GRID_SIZE - BallComponent.margin * 2}
        />
    }

}

export class Game extends React.Component<{}, {balls: Array<BallInfo>}> {
    static OFFSET_TOP = 3;
    static OFFSET_LEFT = 3;
    static GRID_SIZE = 30;
    static GRID_COUNT = 9;
    static ballIdSeq = 1;

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

    constructor(props: {}) {
        super(props);
        this.state = {balls: new Array<BallInfo>()};
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
        this.setState({
            balls:this.state.balls.concat({id: Game.ballIdSeq++, gridX: gridX, gridY: gridY})
        });
    }


    render() {
        let ballComponents = this.state.balls.map((ball)=>{
            return <BallComponent key={ball.id} ballInfo={ball} />;
        });
        return (
            <div>
            <svg className="game-svg" width="1000px" height="1000px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                {this.createHLines()}        
                {this.createVLines()}        
                {ballComponents}
            </svg>
            <div className="touch-layer" onClick={(e)=>this.handleClick(e)}></div>
            </div>
        )
    }
}