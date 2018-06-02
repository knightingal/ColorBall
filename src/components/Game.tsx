import * as React from 'react';
interface BallInfo {
    id: number;
    gridX: number;
    gridY: number;
}
class BallComponent extends React.Component<{ballInfo: BallInfo, selected: boolean},{}> {
    static margin: number = 3;
    constructor(props: {ballInfo: BallInfo, selected: boolean}) {
        super(props);
    }

    render() {
        return <rect 
            className={this.props.selected ? "rect-ball-selected": "rect-ball"}
            x={Game.OFFSET_TOP + this.props.ballInfo.gridX * Game.GRID_SIZE + BallComponent.margin} 
            y={Game.OFFSET_TOP + this.props.ballInfo.gridY * Game.GRID_SIZE + BallComponent.margin} 
            width={Game.GRID_SIZE - BallComponent.margin * 2}
            height={Game.GRID_SIZE - BallComponent.margin * 2}
        />
    }

}

export class Game extends React.Component<{}, {balls: Array<BallInfo>, selectedBallId:number}> {
    static OFFSET_TOP = 3;
    static OFFSET_LEFT = 3;
    static GRID_SIZE = 30;
    static GRID_COUNT = 9;
    ballIdSeq = 1;

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

    constructor(props: {}) {
        super(props);
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
                this.setState({
                    balls:this.state.balls.concat({id: this.ballIdSeq++, gridX: gridX, gridY: gridY}),
                    selectedBallId: null
                });
            } else {
                // select a ball, move to new grid
                const selectedBall:BallInfo = this.findBallById(this.state.selectedBallId);
                if (selectedBall != null) {
                    this.ballMatrix[selectedBall.gridX][selectedBall.gridY] = null;
                    selectedBall.gridX = gridX;
                    selectedBall.gridY = gridY;
                    this.ballMatrix[selectedBall.gridX][selectedBall.gridY] = selectedBall.id;
                    this.setState({
                        selectedBallId: null
                    });

                }

            }
        }
    }


    render() {
        let ballComponents = this.state.balls.map((ball)=>{
            const selected: boolean = ball.id == this.state.selectedBallId;
            return <BallComponent key={ball.id} ballInfo={ball} selected={selected}/>;
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