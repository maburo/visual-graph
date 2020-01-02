import { Camera } from "./camera";
import { BBox, Render } from "./render";
import { Node } from "./components/node";

export default class MiniMapRender extends Render {
  width:number;
  height:number;
  bbox:BBox;
  private size:number;
  private ctx:CanvasRenderingContext2D;
  private scale:number;
  private root:HTMLElement;

  constructor(root:HTMLElement, camera:Camera, size:number) {
    super(camera);
    this.size = size;
  }

  init(width:number, height:number) {
    this.root = document.createElement('div');
    this.root.setAttribute('class', 'minimap');
    this.width = width * this.size;
    this.height = height * this.size;

    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext('2d');    
    this.root.appendChild(canvas);

    this.render();
  }

  get domElement() {
    return this.root;
  }

  onResize(x:number, y:number) {
    this.width = x;
    this.height = y;
  }
  
  createNode(el:any):Node {
    const x = el.diagramX * this.scale;
    const y = el.diagramY * this.scale;
    
    this.ctx.fillRect(x, y, 3, 3);
    return null;
  }

  render() {
  }

  create(bbox:BBox, nodes:Node[]) {
    const scale = Math.min(this.height / bbox.height, this.width / bbox.width);
    const offsetX = (this.width - bbox.width * scale) / 2;
    const offsetY = (this.height - bbox.height * scale) / 2;

    this.ctx.fillStyle = 'black';

    nodes.forEach((n) => {
      const x = n.x * scale + offsetX;
      const y = n.y * scale + offsetY;
      this.ctx.fillRect(x, y, 1, 1);
    });
  }

}