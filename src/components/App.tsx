import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RefObject } from 'react';

import NodeComponent from './nodes/node-component';
import RenderElement from '../render/render-element';
import ContextMenu from './contextMenu';

import Camera from '../render/camera';
import Graph from '../graph';
import HtmlRender from '../render/html/htmlRenderer';

import './../styles/style.scss'
import CommandManager from '../commands/commandMgr';
import AddElementCmd from '../commands/addElementCmd';
import { v1 as uuidv1 } from 'uuid';
import { FlowElement, RequestType } from 'ib-flow-typings';
import HtmlElementFactory from '../render/html/htmlElementFactory';
import GraphController from '../graphController';
import HtmlRenderer from '../render/html/htmlRenderer';
import Node from '../node';

interface Props {
  cmdManager: CommandManager;
}

interface NodeContainerProps {
  element: Element;
}

// class NodeContainer extends React.Component<NodeContainerProps> {
//   render() {
//     return ReactDOM.createPortal(this.props.children, this.props.element);
//   }
// }

interface State {
  visibleElements: RenderElement<FlowElement>[];
}

/**
 * TODO: wrapper with data
 */

// https://gist.github.com/leimonio/d6fd6586520f6e6ac044f54772ef8e1c
class App extends React.Component<Props, State> {
  private graph: Graph<FlowElement>;
  private renderer: HtmlRenderer<FlowElement>;
  private ref: RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.ref = React.createRef();

    this.state = { visibleElements: [] };

    this.graph = new Graph();
    this.renderer = new HtmlRender(this.graph, new HtmlElementFactory(), new Camera()).initialize();

    new GraphController(this.renderer, props.cmdManager).register(this.renderer.domElement);
    
    this.graph.renderer = this.renderer;
    this.graph.renderer.render();
    // this.graph.renderer.freeCamera = false;

    this.renderer.onVisibleNodesChange = this.setVisibleNodes.bind(this);

    setTimeout(() => this.ref.current.appendChild(this.graph.renderer.domElement));

    fetch('/14170273.json')
      .then((response) => response.json())
      .then((json:any) => {
        json.startElements.forEach((el: any) => this.graph.addNode(new Node(el.id, el, el.diagramX, el.diagramY)));
        json.flowElements.forEach((el: any) => this.graph.addNode(new Node(el.id, el, el.diagramX, el.diagramY)));
      })
      .then(() => this.renderer.update());
  }

  setVisibleNodes(visibleElements: RenderElement<FlowElement>[]) {
    console.log('R >> set visible', visibleElements);
    
    this.setState({ visibleElements });
  }

  render() {
    return (
      <div 
        className="graph-container" 
        // ref={el => { el.appendChild(this.graph.renderer.domElement) }} 
        ref={this.ref} 
        >

        <ContextMenu 
          domElement={this.graph.renderer.domElement} 
          menuItems={[
            {key: 'add', name: 'Add node', callback: this.onAddNode.bind(this) }
            ]} />

        {
          this.state.visibleElements.map(renderElement => ReactDOM.createPortal(this.renderNode(renderElement), renderElement.container))
          // this.state.visibleElements.map(renderElement => {
            // return ReactDOM.createPortal(<div 
            //   // ref={element => visibleElement.updateSize(element.getBoundingClientRect())}
            //   >hello world</div>, renderElement)
          // })
        }
      </div>
    );
  }

  private renderNode(renderElement: RenderElement<FlowElement>) {
    return (
    <NodeComponent renderElement={renderElement}>

    </NodeComponent>);
  }

  private onAddNode(x: number, y: number) {
    const localCoords = this.graph.renderer.toLocalCoordinates(x, y);
    this.props.cmdManager.execute(new AddElementCmd(this.graph, uuidv1(), localCoords.x, localCoords.y, {
      diagramX: x,
      diagramY: y,
      id: uuidv1(),
      type: 'SEND_ACTION',
      action: {
        serviceMessagingData: {
          requestType: RequestType.APPLICATION_TYPE_WHATSAPP,
          serviceData: {
            deliveryOptions: {
              validityPeriod: 2880
            },
            sender: "60327804677",
            message: {
              type: "TEXT",
              text: "Opps! Sorry, i didnt get that. Please help me to understand better.\n\nYou may also talk to our Claims Care Representative, please contact us at 1-300-88-1007"
            },
          }
        }
      }
    }));
  }
}

export default App;