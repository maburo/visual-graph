import { Renderer } from '../render';
import Graph from '../../graph';
import Camera from '../camera';
import debugConsole from '../../console';
import { Point2D, Point3D } from '../math/point';
import { Matrix3D } from '../math/matrix';

export default class HtmlRenderer extends Renderer {
  private root:HTMLElement;
  private container:HTMLElement;
  private viewportSize:Point2D;
  private mousePos:Point2D = new Point2D();
  private viewMatrix: number[] = Matrix3D.identity();

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

    const projectedMousePos = new Point3D(this.camera.postion.x, this.camera.postion.y, 1).mtxMul(this.viewMatrix);

    debugConsole.log('trMtx', trMtx)
    debugConsole.log('vp', this.camera.viewportMtx)
    debugConsole.log('screen mouse', this.mousePos)
    // debugConsole.log('proj mouse', projectedMousePos)
    debugConsole.log('zoom', this.camera.zoomLevel.toFixed(2))
   
    this.camera.update(delta);
    
    let m = Matrix3D.identity();
    
    m = Matrix3D.mul(m, vpMtx);
    m = Matrix3D.mul(m, scaleMtx);
    m = Matrix3D.mul(m, trMtx);

    this.viewMatrix = Matrix3D.invert(Matrix3D.copy(m))
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