import Camera from "./camera";
import Graph from '../graph';
import { ElementFactory } from "./html/htmlElementFactory";
import Node from "../node";
import AABB from './math/aabb';
import { Point2D, Point3D } from './math/point';
import RenderElement from "./render-element";

export function clamp(value:number, min:number, max:number) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

/**
 * Render
 */
export default abstract class Renderer<T, R> {
  readonly graph:Graph<T>;
  readonly camera:Camera;
  readonly elementFactory: ElementFactory<T, R>;

  private time:number;
  
  // protected minimap: Renderer;
  protected bbox:AABB = new AABB();

  zoomToCursor:boolean = false;
  enableMinimap:boolean = true;

  mouseScreenPos: (x:number, y:number) => void;

  set freeCamera(enable:boolean) {
    this.camera.bbox = enable ? null : this.bbox;
  }
  
  constructor(graph: Graph<T>, camera:Camera, elementFactory: ElementFactory<T, R>) {
    this.graph = graph;
    this.camera = camera;
    this.elementFactory = elementFactory;
  }

  checkSize() {
    const { x: vpWidth, y: vpHeight } = this.camera.viewportSize;
    const clientWidth = this.domElement.parentElement?.clientWidth;
    const clientHeight = this.domElement.parentElement?.clientHeight;

    if (clientWidth != vpWidth || clientHeight != vpHeight) {
      this.onResize(clientWidth, clientHeight);
      this.camera.viewportSize = new Point2D(clientWidth, clientHeight);
    }
  }

  render() {
    const now = Date.now();
    const delta = now - this.time;

    this.checkSize();
    this.camera.update(delta);

    // const frustum = this.camera.viewFrustum();
    // const visibleNodes = this.collectVisibleNodes(frustum);
    // this.draw(visibleNodes);
    // this.setVisibleNodes([]);
    
    this.draw(delta, this.graph);

    this.time = now;
    window.requestAnimationFrame(() => this.render());
  }

  set onVisibleNodesChange(callback: (visible: RenderElement<T>[]) => void) {
    this.setVisibleNodes = callback;
  }

  collectVisibleNodes(aabb: AABB) {

  }

  initialize() {
    this.init();
    this.domElement.className = 'graph';
    return this;
  }

  protected setVisibleNodes: (visible: RenderElement<T>[]) => void;
  
  protected abstract init(): void;
  protected abstract draw(delta: number, grap: Graph<T>): void;

  abstract get domElement(): HTMLElement;
  
  abstract onMouseMove(x: number, y: number): void;
  abstract toLocalCoordinates(x: number, y: number): Point3D;
  abstract addNode(node: Node<T>): void;
  abstract removeNode(id: string): void;
  abstract onResize(width: number, height: number): void;

  abstract update(): void;
}