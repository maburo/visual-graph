import * as React from 'react';
//import './../styles/style.css'
import './../styles/style.scss'
import { NodeComponent, NodeType } from './node';
import { StartInboundNode } from './start-inbound-node'
import { FlowElementType } from '../types';

class App extends React.Component {
  render() {
    return (
    <div>
      {/* <NodeComponent  id={0}
                      x={0}
                      y={0}
                      width={100}
                      height={30}
                      type={NodeType.ACTION_ELEMENT}
                      selected={false}
                    //  children={null}
                      >
          <StartInboundNode id={1}
                            type={"START_RESOLVE_ONETIME_AUDIENCE"} />

        </NodeComponent> */}
    </div>
    );
  }
}

export default App;