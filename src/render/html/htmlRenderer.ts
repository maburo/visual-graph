import { Renderer, Point2D, AABB, Matrix3D } from '../render';
import Graph from '../../graph';
import Camera from '../camera';

export default class HtmlRenderer extends Renderer {
  private root:HTMLElement;
  private container:HTMLElement;
  private viewportSize:Point2D;
  private mousePos:Point2D = new Point2D();

  constructor(camera:Camera) {
    super(camera);
    camera.zoomSense = 0.0001;
  }

  init(width:number, height:number):void {
    this.root = document.createElement('div');
    this.root.className = 'graph';
    this.container = document.createElement('div');
    this.container.className = 'container';
    this.root.appendChild(this.container);

    this.root.style.width = width + 'px';
    this.root.style.height = height + 'px';
  }

  onMouseMove(x:number, y:number) {
    this.mousePos = new Point2D(x, y);
  }
  
  render(delta:number, grap:Graph):void {
    this.camera.update(delta);
    
    const trMtx = this.camera.translationMtx;
    const scaleMtx = this.camera.scaleMtx;
    const vpMtx = this.camera.viewportMtx;
    const invVpMtx = [1, 0, vpMtx[2], 0, 1, vpMtx[5], 0, 0, 1];
   
    this.camera.update(delta);
    
    let m = Matrix3D.identity;
    
    m = Matrix3D.mul(vpMtx, scaleMtx)
    m = Matrix3D.mul(m, invVpMtx)
    m = Matrix3D.mul(m, trMtx);
    
    this.container.style.transform = `matrix(${m[0]},${m[3]},${m[1]},${m[4]},${m[2]},${m[5]})`;
  }

  onResize(size:Point2D):void {
    this.root.style.width = size.x + 'px';
    this.root.style.height = size.y + 'px';
    this.camera.viewportSize = size;
  }

  create(graph:Graph):void {
    graph.nodeList.forEach(node => {
      const htmlNode = document.createElement('div');
      htmlNode.className = 'node';
      htmlNode.style.left = node.x + 'px';
      htmlNode.style.top = node.y + 'px';
      
      this.container.appendChild(htmlNode);
      this.bbox.addPoint(node.x, node.y);
    });

    const center = document.createElement('div');
    center.style.position = 'absolute';
    center.style.width = '32px';
    center.style.height = '32px';
    center.style.backgroundColor = 'green';
    this.container.appendChild(center);
  }

  get domElement():HTMLElement {
    return this.root;
  }
}