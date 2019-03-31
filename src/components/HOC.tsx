import * as React from 'react';
import { render } from 'react-dom';

class BlogPost extends React.Component<{}, {}> {
    render() {

        return React.createElement('div', null, null);
    }
}


class BlogPost1 extends React.Component<{}, {}> {
    render() {
        return React.createElement(BlogPost, null, null);
    }
}

interface Props {
    data:string
}

function withSubscription(WrappedComponent:React.ComponentClass<Props>): React.ComponentClass {
    return class extends React.Component<Props, {data:string}> {
        constructor(props:any) {
            super(props);
            this.state = {
                data:"1"
            }
        }

        render() {
            return <WrappedComponent 
                data={this.state.data}
                {...this.props} 
            />;
        }
    }
}

class CP2 extends React.Component<{data:string, data2:number}, {}> {
    render() {
        return <div />;
    }

}

let Pcp2 = withSubscription(CP2);