import { Camera } from "./camera";
import MiniMapRender from "./miniMapRender";
import { Render, BBox, Point2D } from "./render";
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
  private lod:number = 0;
  private nodes:Node[];
  private mainRender:Render;
  private minimap:MiniMapRender;
  private _bbox:BBox = new BBox();
  private camera:Camera;
  private nodeMap:INodeMap = {};
  private edgeMap:EdgeMap = new EdgeMap();
  private width:number;
  private height:number;
  

  constructor(root:HTMLElement, render:Render, camera:Camera) {
    this.root = root;
    this.mainRender = render;
    this.camera = camera;
  }

  set enableMinimap(value:boolean) {
    if (value) {      
      this.minimap = new MiniMapRender(this.root, this.camera, .25);
      this.minimap.init(this.root.clientWidth, this.root.clientHeight);
      this.root.appendChild(this.minimap.domElement);
    }
  }

  set size(value:Point2D) {
    this.root.style.width = value.x + 'px';
    this.root.style.height = value.y + 'px';
    this.mainRender.onResize(value.x, value.y);
    this.minimap.onResize(value.x, value.y);
    this.width = value.x;
    this.height = value.y;

    this.camera.size = this.size;
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

  get bbox() {
    return this._bbox;
  }

  init() {
    this.mainRender.init(this.root.clientWidth, this.root.clientHeight);
    this.root.append(this.mainRender.domElement);
  }

  render() {
    if (this.camera.update()) {
      this.mainRender.render();
      this.minimap.render();
    }

    window.requestAnimationFrame(() => this.render());
  }

  onResize() {

  }

  setLodLevel(value:number) {
    this.lod = value;
  }

  create(graph:any) {
    this.nodes = graph.flowData.flowElements.map((el:any) => {      
      const node = new Node(el.id, el.diagramX, el.diagramY);

      el.rules?.forEach((rule:any) => {        
        this.edgeMap.put(node.id, new Edge(rule.nextElementId, EdgeDirection.out));
        this.edgeMap.put(rule.nextElementId, new Edge(node.id, EdgeDirection.in));
      });

      if (el.action?.nextElementId) {
        this.edgeMap.put(node.id, new Edge(el.action.nextElementId, EdgeDirection.out));
        this.edgeMap.put(el.action.nextElementId, new Edge(node.id, EdgeDirection.in));
      }      
      
      this._bbox.addPoint(node.x, node.y);
      this.nodeMap[node.id] = node;
      return node;
    });
   
    this.minimap.create(this);
    this.mainRender.create(this);

    this.camera.bbox = this._bbox;    
  }
}