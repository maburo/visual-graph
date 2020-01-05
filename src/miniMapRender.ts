import { Camera } from "./camera";
import { BBox, Render, Point2D } from "./render";
import Node from "./node";
import Graph from "./graph";

interface Layer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

function createLayer(): Layer {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

export default class MiniMapRender extends Render {
  width:number;
  height:number;
  bbox:BBox;
  private size:number;
  private mapLayer: Layer;
  private camLayer: Layer;
  private scale:number;
  private root:HTMLElement;
  private offset:Point2D = new Point2D();

  constructor(root:HTMLElement, camera:Camera, size:number) {
    super(camera);
    this.size = size;
  }

  init(width:number, height:number) {
    this.root = document.createElement('div');
    this.root.setAttribute('class', 'minimap');
    this.width = width * this.size;
    this.height = height * this.size;

    this.mapLayer = createLayer();
    this.camLayer = createLayer();

    this.onResize(this.width, this.height);

    this.root.appendChild(this.mapLayer.canvas);
    this.root.appendChild(this.camLayer.canvas);
  }

  get domElement() {
    return this.root;
  }

  onResize(x:number, y:number) {    
    this.mapLayer.canvas.width = this.width;
    this.mapLayer.canvas.height = this.height;
    this.camLayer.canvas.width = this.width;
    this.camLayer.canvas.height = this.height;
    // this.width = x;
    // this.height = y;
  }

  render() {
    const ctx = this.camLayer.ctx;
    const pos = new Point2D(this.camera.postion.x, this.camera.postion.y)
    .mul(this.scale)
    .add(this.offset)
    
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.strokeStyle = "blue";
    const vpw = this.width * this.scale / this.camera.postion.z;
    const vph = this.height * this.scale / this.camera.postion.z;
    
    ctx.strokeRect((pos.x - vpw / 2), (pos.y - vph / 2), vpw, vph);
    ctx.beginPath();
    ctx.moveTo(pos.x - 10, pos.y);
    ctx.lineTo(pos.x + 10, pos.y);
    ctx.moveTo(pos.x, pos.y - 10);
    ctx.lineTo(pos.x, pos.y + 10);
    ctx.stroke();
  }

  create(graph:Graph) {
    const scale = Math.min(this.height / graph.bbox.height, this.width / graph.bbox.width);
    const center = new Point2D(this.width / 2, this.height / 2);
    const offset = center.sub(graph.bbox.center.mul(scale));

    this.scale = scale;
    this.offset = offset;

    this.mapLayer.ctx.fillStyle = "#FFFFFFCC";
    this.mapLayer.ctx.fillRect(0, 0, this.width, this.height);
    this.mapLayer.ctx.fillStyle = 'black';

    this.mapLayer.ctx.fillRect(center.x-2, center.y-2, 2, 2)

    graph.nodeList.forEach((n:Node) => {
      this.drawNode(n, scale, offset);
    });
  }

  drawNode(node:Node, scale:number, offset:Point2D) {
    const x = node.x * scale + offset.x;
    const y = node.y * scale + offset.y;
    this.mapLayer.ctx.fillRect(x, y, 1, 1);
  }
}