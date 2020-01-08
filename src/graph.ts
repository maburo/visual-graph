// import Camera from "./camera";
import { Renderer, AABB, Point2D } from "./render/render";
import Node from "./node";

interface IEdgeMap {
  [key:string]: Edge[];
}

interface INodeMap {
  [key:string]: Node
}

enum EdgeDirection {
  in, out
}

class Edge {
  readonly dir:EdgeDirection;
  readonly target:string;

  constructor(target:string, dir:EdgeDirection) {
    this.dir = dir;
    this.target = target;
  }
}

class EdgeMap {
  private adjecensyMap:IEdgeMap = {};

  put(id:string, edge:Edge) {
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
export default class Graph {
  private root:HTMLElement;
  private nodes:Node[] = [];
  private renderEngine:Renderer;
  private nodeMap:INodeMap = {};
  private edgeMap:EdgeMap = new EdgeMap();
  private width:number;
  private height:number;
  private time:number;

  constructor(root:HTMLElement) {
    this.root = root;
  }

  set enableMinimap(value:boolean) {
    this.renderEngine.enableMinimap = value;
  }

  set renderer(renderer:Renderer) {
    if (this.renderEngine) {
      this.root.removeChild(this.renderEngine.domElement);
    }
    
    this.renderEngine = renderer;
    this.renderEngine.init(this.size.x, this.size.y);
    this.renderEngine.onResize(new Point2D(this.width, this.height));
    this.root.appendChild(this.renderEngine.domElement);

    this.renderEngine.create(this);
  }

  get size():Point2D {
    return new Point2D(this.width, this.height);
  }

  get nodeList():Node[] {
    return this.nodes;
  }

  get adjecensyMap() {
    return this.edgeMap;
  }

  getNode(id:string):Node {
    return this.nodeMap[id];
  }

  render() {    
    const now = Date.now()
    const delta = now - this.time;

    this.checkSize();
    this.renderEngine.render(delta,this);

    this.time = now;
    window.requestAnimationFrame(() => this.render());
  }

  checkSize() {
    if (this.root.clientWidth != this.width || this.root.clientHeight != this.height) {
      this.width = this.root.clientWidth;
      this.height = this.root.clientHeight;
      this.renderEngine.onResize(new Point2D(this.width, this.height));
      return true;
    }

    return false;
  }

  create(graph:any) {
    this.nodes = graph.flowData.flowElements.map((el:any) => {      
      const node = new Node(el.id, el.type, el, el.diagramX, el.diagramY);

      el.rules?.forEach((rule:any) => {        
        this.edgeMap.put(node.id, new Edge(rule.nextElementId, EdgeDirection.out));
        this.edgeMap.put(rule.nextElementId, new Edge(node.id, EdgeDirection.in));
      });

      if (el.action?.nextElementId) {
        this.edgeMap.put(node.id, new Edge(el.action.nextElementId, EdgeDirection.out));
        this.edgeMap.put(el.action.nextElementId, new Edge(node.id, EdgeDirection.in));
      }
      
      this.nodeMap[node.id] = node;
      return node;
    });

    this.renderEngine.create(this);  
  }

  addNode() {

  }

  addEdge() {

  }
}