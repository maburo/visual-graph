import Node from './node';
import { Camera } from "./camera";

export function clamp(value:number, min:number, max:number) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

export class Point {
  x: number;
  y: number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * BBox
 */
export class BBox {
  min = new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  max = new Point(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

  addPoint(x:number, y:number) {
    if (this.max.x < x) this.max.x = x;
    if (this.min.x > x) this.min.x = x;
    if (this.max.y < y) this.max.y = y;
    if (this.min.y > y) this.min.y = y;
  }

  get width() {
    return Math.abs(this.max.x - this.min.x);
  }

  get height() {
    return Math.abs(this.max.y - this.min.y);
  }
}

/**
 * Render
 */
export abstract class Render {
  readonly camera:Camera;
  
  constructor(camera:Camera) {
    this.camera = camera;
  }

  abstract render():void;
  abstract onResize(width:number, height:number):void;
  abstract createNode(el:any):Node;
  abstract init(width:number, height:number):void;
  abstract get domElement():HTMLElement;
}