import Camera from "./camera";
import Graph from '../graph';

export function clamp(value:number, min:number, max:number) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

export class Matrix3D {
  static identity:Array<number> = [1, 0, 0, 0, 1, 0, 0, 0, 1];

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

  static mm(...m:Array<Array<number>>) {
    return m.slice(1).reduce((acc:Array<number>, val:Array<number>) => {
      acc[0] * val[0] + acc[1] * val[3] + acc[2] * val[6],
      acc[0] * val[1] + acc[1] * val[4] + acc[2] * val[7],
      acc[0] * val[2] + acc[1] * val[5] + acc[2] * val[8],

      acc[3] * val[0] + acc[4] * val[3] + acc[5] * val[6],
      acc[3] * val[1] + acc[4] * val[4] + acc[5] * val[7],
      acc[3] * val[2] + acc[4] * val[5] + acc[5] * val[8],

      acc[6] * val[0] + acc[7] * val[3] + acc[8] * val[6],
      acc[6] * val[1] + acc[7] * val[4] + acc[8] * val[7],
      acc[6] * val[2] + acc[7] * val[5] + acc[8] * val[8]
      return acc;
    }, m[0]);
  }

  static invTranslation(m:Array<number>) {
    m[2] = -m[2];
    m[5] = -m[5];
    return m;
  }

  mul3(a:Array<number>, b:Array<number>, c:Array<number>, d:Array<number>):Array<number> {
    let m = Matrix3D.mul(a, b);
    m = Matrix3D.mul(m, c);
    return Matrix3D.mul(m, d);
  }

  static translation(x:number, y:number):Array<number> {
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

  mul(num:number) {
    return new Point3D(this.x * num, this.y * num, this.z * num);
  }

  addScalar(num:number) {
    return new Point3D(this.x + num, this.y + num, this.z + num);
  }
}

export class Point2D {
  x: number;
  y: number;

  constructor(x:number = 0, y:number = 0) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
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

  get translation() {
    return [
      1, 0, this.x,
      0, 1, this.y,
      0, 0, 1
    ]
  }
}

/**
 * AABB
 */
export class AABB {
  minX = Number.MAX_SAFE_INTEGER;
  minY = Number.MAX_SAFE_INTEGER;
  maxX = Number.MIN_SAFE_INTEGER;
  maxY = Number.MIN_SAFE_INTEGER;

  constructor(minX:number = null, 
              minY:number = null,
              maxX:number = null,
              maxY:number = null) 
  {
    if (minX) this.minX = minX;
    if (minY) this.minY = minY;
    if (maxX) this.maxX = maxX;
    if (maxY) this.maxY = maxY;
  }

  contains(x:number, y:number) {
    return x >= this.minX && x <= this.maxX && 
           y >= this.minY && y <= this.maxY;
  }

  addPoint(x:number, y:number) {
    if (this.maxX < x) this.maxX = x;
    if (this.minX > x) this.minX = x;
    if (this.maxY < y) this.maxY = y;
    if (this.minY > y) this.minY = y;
  }

  get width() {
    return Math.abs(this.maxX - this.minX);
  }

  get height() {
    return Math.abs(this.maxY - this.minY);
  }

  get center():Point2D {
    return new Point2D(this.minX + this.width / 2,
                       this.minY + this.height / 2);
  }
}

/**
 * Render
 */
export abstract class Renderer {
  zoomToCursor = true;
  readonly camera:Camera;
  protected minimap:Renderer;
  enableMinimap:boolean = true
  
  constructor(camera:Camera) {
    this.camera = camera;
  }

  abstract render(delta:number, grap:Graph):void;
  abstract onResize(size:Point2D):void;
  abstract create(graph:Graph):void;
  abstract init(width:number, height:number):void;
  abstract get domElement():HTMLElement;
}