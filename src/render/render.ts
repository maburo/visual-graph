import Camera from "./camera";
import Graph from '../graph';
import AABB from "./math/aabb";
import { Point2D } from "./math/point";

export function clamp(value:number, min:number, max:number) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

/**
 * Render
 */
export abstract class Renderer {
  zoomToCursor = false;
  readonly camera:Camera;
  protected minimap:Renderer;
  enableMinimap:boolean = true;
  protected bbox:AABB = new AABB();
  mouseScreenPos: (x:number, y:number) => void;

  set freeCamera(enable:boolean) {
    this.camera.bbox = enable ? null : this.bbox;
  }
  
  constructor(camera:Camera) {
    this.camera = camera;
  }

  abstract render(delta:number, grap:Graph):void;
  abstract onResize(size:Point2D):void;
  abstract create(graph:Graph):void;
  abstract init(width:number, height:number):void;
  abstract get domElement():HTMLElement;
  abstract onMouseMove(x:number, y:number):void;
}