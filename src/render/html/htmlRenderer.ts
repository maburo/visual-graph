import { Renderer } from '../render';
import Graph from '../../graph';
import Camera from '../camera';
import debugConsole from '../../console';
import { Vector2D, Vector3D } from '../math/vector';
import { Matrix3D } from '../math/matrix';

export default class HtmlRenderer extends Renderer {
  private root:HTMLElement;
  private container:HTMLElement;
  private viewportSize:Vector2D;
  private mousePos:Vector2D = new Vector2D();
  invertedMtx: number[] = Matrix3D.identity();

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
    this.mousePos = new Vector2D(x, y);
  }
  
  render(delta:number, grap:Graph):void {
    const zooming = this.camera.zooming;
    this.camera.update(delta);
    const pos = this.camera.postion
    const screenCenter = this.camera.viewportSize.div(2);
    const projMousePos = this.toLocalCoordinates(this.mousePos.x, this.mousePos.y);

    const zoomDelta = projMousePos.sub(pos)
    const zoomCenter = Matrix3D.translation(-zoomDelta.x, -zoomDelta.y)
    const zoomCenterInv = Matrix3D.translation(zoomDelta.x, zoomDelta.y)

    const trMtx = pos.translationMtx;
    const scaleMtx = this.camera.scaleMtx;
    const vpMtx = this.camera.viewportMtx;

    // debugConsole.log('trMtx', Matrix3D.toString(trMtx))
    // debugConsole.log('scMtx', Matrix3D.toString(scaleMtx))
    // debugConsole.log('inv', Matrix3D.toString(this.invertedMtx))
    // debugConsole.log('vp', Matrix3D.toString(this.camera.viewportMtx))
    debugConsole.log('screen mouse', this.mousePos)
    debugConsole.log('proj mouse', projMousePos)
    debugConsole.log('zoom', this.camera.zoomLevel.toFixed(2))
   
    this.camera.update(delta);
    
    let m = Matrix3D.identity();
    
    Matrix3D.mul(m, vpMtx);
    if (zooming) {
      Matrix3D.mul(m, zoomCenterInv)
      Matrix3D.mul(m, scaleMtx)
      Matrix3D.mul(m, zoomCenter)
    } else {
      Matrix3D.mul(m, scaleMtx)
    }
    Matrix3D.mul(m, trMtx);

    this.invertedMtx = Matrix3D.invert(Matrix3D.copy(m));

    if (zooming) {
      const newCamPos = this.toLocalCoordinates(screenCenter.x, screenCenter.y);
      this.camera.setPosition(newCamPos.x, newCamPos.y)
    }

    this.container.style.transform = Matrix3D.cssMatrix(m);
  }
  x: number = 0;
  y: number = 0;

  toLocalCoordinates(x: number, y: number) {
    try {
      return new Vector3D(x, y, 1).mtxMul(this.invertedMtx);
    } catch (e) {
      console.log(this.invertedMtx)
      throw e;
    }
  }

  onResize(size:Vector2D):void {
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