import * as React from 'react';

export class Game extends React.Component<{}, {}> {
    OFFSET_TOP=3;
    OFFSET_LEFT=3;
    GRID_SIZE=30;
    GRID_COUNT=9;

    createHLine(index:number) {
        return <line 
            className="game-line" key={index}
            x1={this.OFFSET_LEFT} 
            y1={this.GRID_SIZE*index + this.OFFSET_TOP} 
            x2={this.GRID_SIZE*this.GRID_COUNT+this.OFFSET_LEFT} 
            y2={this.GRID_SIZE*index + this.OFFSET_TOP}/>
    }

    createVLine(index:number) {
        return <line 
            className="game-line" key={index}
            y1={this.OFFSET_TOP} 
            x1={this.GRID_SIZE*index + this.OFFSET_LEFT} 
            y2={this.GRID_SIZE*this.GRID_COUNT+this.OFFSET_TOP} 
            x2={this.GRID_SIZE*index + this.OFFSET_LEFT}/>
    }



    createHLines() {
        const ret=new Array<React.ReactNode>();
        for (let i:number=0;i<this.GRID_COUNT+1;i++) {
            ret.push(this.createHLine(i));
        }
        return ret;
    }

    createVLines() {
        const ret=new Array<React.ReactNode>();
        for (let i:number=0;i<this.GRID_COUNT+1;i++) {
            ret.push(this.createVLine(i));
        }
        return ret;
    }

    constructor(props:{}) {
        super(props);
    }


    render() {
        return (
            <svg className="game-svg" width="1000px" height="1000px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                {this.createHLines()}        
                {this.createVLines()}        
            </svg>
        )
    }
}