import { Camera } from "./camera";
import Graph from './graph';

export function clamp(value:number, min:number, max:number) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

export class Matrix3D {
  static mul(a:Array<number>, b:Array<number>):Array<number> {
    return [
      a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
      a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
      a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

      a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
      a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
      a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

      a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
      a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
      a[6] * b[2] + a[7] * b[5] + a[8] * b[8]
    ];
  }

  static translationMtx(x:number, y:number):Array<number> {
    return [
      1, 0, x,
      0, 1, y,
      0, 0, 1
    ]
  }
}

export class Point3D {
  readonly x:number;
  readonly y:number;
  readonly z:number;

  constructor(x:number = 0, y:number = 0, z:number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Point2D {
  x: number;
  y: number;

  constructor(x:number = 0, y:number = 0) {
    this.x = x;
    this.y = y;
  }

  add(p:Point2D):Point2D {
    return new Point2D(this.x + p.x, this.y + p.y);
  }

  sub(p:Point2D):Point2D {
    return new Point2D(this.x - p.x, this.y - p.y);
  }

  div(num:number) {
    return new Point2D(this.x / num, this.y / num);
  }

  mul(num:number) {
    return new Point2D(this.x * num, this.y * num);
  }
}

/**
 * BBox
 */
export class BBox {
  min = new Point2D(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  max = new Point2D(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

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

  get center():Point2D {
    return new Point2D(this.min.x + this.width / 2,
                       this.min.y + this.height / 2);
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
  abstract create(graph:Graph):void;
  abstract init(width:number, height:number):void;
  abstract get domElement():HTMLElement;
}