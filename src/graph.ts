import Renderer from "./render/render";
import Node from "./node";
import { Point2D } from './render/math/point';

interface IEdgeMap {
  [key:string]: Edge[];
}

interface INodeMap<T> {
  [key:string]: Node<T>
}

enum EdgeDirection {
  in, out
}

class Edge {
  readonly dir: EdgeDirection;
  readonly target: string;

  constructor(target: string, dir: EdgeDirection) {
    this.dir = dir;
    this.target = target;
  }
}

class EdgeMap {
  private adjecensyMap: IEdgeMap = {};

  put(id:string, edge: Edge) {
    let list = this.adjecensyMap[id];
    if (!list) {
      list = this.adjecensyMap[id] = [];
    }
    list.push(edge);
  }

  adjacent(id:string):Edge[] {
    return this.adjecensyMap[id] || [];
  }

  incoming(id:string) {
    return this.adjecensyMap[id]?.filter(edge => edge.dir === EdgeDirection.in) || [];
  }

  outcoming(id:string) {
    return this.adjecensyMap[id]?.filter(edge => edge.dir === EdgeDirection.out) || [];
  }
}

/**
 * Graph
 */
export default class Graph<T> {
  private renderEngine: Renderer<T, unknown>;
  private nodeMap: INodeMap<T> = {};
  private edgeMap: EdgeMap = new EdgeMap();
  private width: number;
  private height: number;

  set enableMinimap(value: boolean) {
    this.renderEngine.enableMinimap = value;
  }

  set renderer(renderer: Renderer<T, unknown>) {
    this.renderEngine = renderer;
    // this.renderEngine.init(this.size.x, this.size.y);
    // this.renderEngine.create(this);
  }

  get renderer() {
    return this.renderEngine;
  }

  get size(): Point2D {
    return new Point2D(this.width, this.height);
  }

  get nodeList(): Node<T>[] {
    return Object.values(this.nodeMap);
  }

  get adjecensyMap() {
    return this.edgeMap;
  }

  getNode(id:string): Node<T> {
    return this.nodeMap[id];
  }

  addNode(node: Node<T>) {
    if (this.nodeMap[node.id]) return;

    this.nodeMap[node.id] = node;
    
    this.renderEngine.addNode(node);
  }

  removeNode(id: string) {
    delete this.nodeMap[id];

    this.renderEngine.removeNode(id);
  }

  addEdge(from: string, to: string) {

  }

  removeEdge(from: string, to: string) {

  }

  // create(graph:any) {
  //   this.nodes = graph.flowData.flowElements.map((el:any) => {      
  //     const node = new Node(el.id, el.type, el, el.diagramX, el.diagramY);

  //     el.rules?.forEach((rule:any) => {        
  //       this.edgeMap.put(node.id, new Edge(rule.nextElementId, EdgeDirection.out));
  //       this.edgeMap.put(rule.nextElementId, new Edge(node.id, EdgeDirection.in));
  //     });

  //     if (el.action?.nextElementId) {
  //       this.edgeMap.put(node.id, new Edge(el.action.nextElementId, EdgeDirection.out));
  //       this.edgeMap.put(el.action.nextElementId, new Edge(node.id, EdgeDirection.in));
  //     }
      
  //     this.nodeMap[node.id] = node;
  //     return node;
  //   });

  //   this.renderEngine.create(this);  
  // }
}