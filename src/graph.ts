import { Camera } from "./camera";
import MiniMapRender from "./miniMapRender";
import { Render, BBox } from "./render";
import { Node } from "./components/node";

/**
 * Graph
 */
export default class Graph {
  root:HTMLElement;
  lod:number = 0;
  nodes:Node[];
  mainRender:Render;
  minimap:MiniMapRender;
  bbox:BBox = new BBox();
  camera:Camera;

  constructor(root:HTMLElement, render:Render, camera:Camera) {
    this.root = root;
    this.mainRender = render;
    this.camera = camera;
  }

  set enableMinimap(value:boolean) {
    if (value) {      
      this.minimap = new MiniMapRender(this.root, new Camera(), .25);
      this.minimap.init(this.root.clientWidth, this.root.clientHeight);
      this.root.appendChild(this.minimap.domElement);
    }
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
      const node = this.mainRender.createNode(el);
      this.bbox.addPoint(node.x, node.y);
      return node;
    });
   
    this.minimap?.create(this.bbox, this.nodes);

    this.camera.bbox = this.bbox;
  }
}