import Renderer from '../render';
import Graph from '../../graph';
import Camera from '../camera';
import RenderElement from '../render-element';
import { ElementFactory } from './htmlElementFactory';
import Node from '../../node';
import { Point2D, Point3D } from '../math/point';
import { Matrix3D } from '../math/matrix';

interface RenderNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class HtmlRenderer<T> extends Renderer<T, HTMLElement> {
  private root: HTMLElement;
  private container: HTMLElement;
  // private viewportSize: Point2D;
  private mousePos: Point2D = new Point2D();

  constructor(graph: Graph<T>, elementFactory: ElementFactory<T, HTMLElement>, camera: Camera) {
    super(graph, camera, elementFactory);
    camera.zoomSense = 0.0001;
  }

  init():void {
    this.root = document.createElement('div');
    this.container = document.createElement('div');
    this.container.className = 'container';
    this.root.appendChild(this.container);

    this.debugOverlay();
  }

  onMouseMove(x:number, y:number) {
    this.mousePos = new Point2D(x, y);
  }

  invertedMtx: number[] = Matrix3D.identity;
  // prevZoomLevel: number = 1;
  // prevMtx: number[] = Matrix3D.identity;
  
  /**
   * draw
   * 
   */
  draw(delta: number, grap: Graph<unknown>): void {
    // console.log('>> draw');
    // console.log(this.camera.postion);
    
    // const localMouseCoords = this.toLocalCoordinates(this.mousePos.x, this.mousePos.y);
    const translationMtx = this.camera.translationMtx;
    const scaleMtx = this.camera.scaleMtx;
    // const vpMtx = [ 1, 0, this.mousePos.x, 0, 1, this.mousePos.y, 0, 0, 1 ];
    // const vpMtx = [ 1, 0, localMouseCoords.x, 0, 1, localMouseCoords.y, 0, 0, 1 ];
    const vpMtx = this.camera.viewportMtx;
    const invVpMtx = [1, 0, vpMtx[2], 0, 1, vpMtx[5], 0, 0, 1];
    // const invVpMtx = Matrix3D.copy(vpMtx);
    // Matrix3D.invert(invVpMtx);
    
    let m = Matrix3D.identity;
    
    m = Matrix3D.mul(m, vpMtx);
    m = Matrix3D.mul(m, scaleMtx);
    // m = Matrix3D.mul(m, invVpMtx);
    m = Matrix3D.mul(m, translationMtx);

    this.invertedMtx = Matrix3D.invert(Matrix3D.copy(m));
    // this.prevZoomLevel = this.camera.zoomLevel;

    
    const screenCenterCoords = this.camera.viewportSize.div(2);
    const localScreenCenterCoords = this.toLocalCoordinates(screenCenterCoords.x, screenCenterCoords.y)

    // console.log(this.invertedMtx);
    // console.log(m);
    // console.log('screen', localScreenCenterCoords);
    // this.camera.setPosition(localScreenCenterCoords);
  
    this.container.style.transform = Matrix3D.cssMatrix(m);
  }

  toLocalCoordinates(x: number, y: number) {
    return new Point3D(x, y, 1).mtxMul(this.invertedMtx);
  }

  children: any = {};

  readonly visibleNodes: RenderElement<T>[] = [];

  /**
   * Add node
   * @param node 
   */
  addNode(node: Node<T>) {
    console.log('add node', node);
    
    const el = this.elementFactory.create(node, 1);
    el.style.left = node.x + 'px';
    el.style.top = node.y + 'px';
    this.visibleNodes.push({container: el, data: node.data});

    // this.bbox.addPoint()

    this.container.appendChild(el);
    this.children[node.id] = el;

    // this.setVisibleNodes(this.visibleNodes);
  }

  update() {
    this.setVisibleNodes(this.visibleNodes);
  }

  /**
   * Remove node
   * @param id 
   */
  removeNode(id: string) {
    // this.bbox.remove()

    const child = this.children[id];
    delete this.children[id];
    this.container.removeChild(child);
  }

  /**
   * Debug
   */
  debugOverlay() {
    const center = document.createElement('div');
    center.style.position = 'absolute';
    center.style.width = '32px';
    center.style.height = '32px';
    center.style.backgroundColor = 'green';
    this.container.appendChild(center);
  }

  onResize(width: number, height: number) {
    this.root.style.width = width + 'px';
    this.root.style.height = height + 'px';
  }

  get domElement():HTMLElement {
    return this.root;
  }
}