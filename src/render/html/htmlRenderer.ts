import { Renderer } from '../render';
import Graph from '../../graph';
import Camera from '../camera';
import debugConsole from '../../console';
import { Vector2D, Vector3D } from '../math/vector';
import { Matrix3D } from '../math/matrix';

export default class HtmlRenderer extends Renderer {
  private root:HTMLElement;
  private container:HTMLElement;
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
    const isZooming = this.camera.zooming;
    if (!this.camera.update(delta)) return;
    
    const pos = this.camera.postion
    const trMtx = pos.translationMtx;
    const scaleMtx = this.camera.scaleMtx;
    const screenCenter = this.camera.viewportSize.div(2);
    const mtx = Matrix3D.translation(screenCenter.x, screenCenter.y);
    // const mtx = Matrix3D.identity()
    
    debugConsole.log('screen mouse', this.mousePos)
    debugConsole.log('zoom', this.camera.zoomLevel.toFixed(2))
    debugConsole.log('cam pos', pos)

    const projMousePos = this.toLocalCoordinates(this.mousePos.x, this.mousePos.y);
    debugConsole.log('proj mouse', projMousePos)

    if (this.zoomToCursor && isZooming) {
      // const zoomDelta = projMousePos.sub(pos)
      const zoomDelta = new Vector3D(100, 100, 1);
      const zoomCenter = Matrix3D.translation(-zoomDelta.x, -zoomDelta.y)
      const zoomCenterInv = Matrix3D.translation(zoomDelta.x, zoomDelta.y)

      // debugConsole.log('scaleMtx', Matrix3D.toString(scaleMtx))
      debugConsole.log('zoom shif', zoomDelta)
      
      Matrix3D.mul(mtx, zoomCenterInv)
      Matrix3D.mul(mtx, scaleMtx)
      Matrix3D.mul(mtx, zoomCenter)
    } else {
      Matrix3D.mul(mtx, scaleMtx)
    }
    
    Matrix3D.mul(mtx, trMtx);
    

    this.invertedMtx = Matrix3D.invert(Matrix3D.copy(mtx));

    if (this.zoomToCursor && isZooming) {
      const newCamPos = this.toLocalCoordinates(screenCenter.x, screenCenter.y);
      this.camera.setPosition(newCamPos.x, newCamPos.y)

      debugConsole.log('screenCenter', screenCenter)
      debugConsole.log('new cam pos', this.camera.position)
      debugConsole.log('mtx', Matrix3D.toString(mtx))
    }

    this.container.style.transform = Matrix3D.cssMatrix(mtx);
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