import Camera from "./camera";
import Graph from '../graph';

export function clamp(value:number, min:number, max:number) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

export class Matrix3D {
  static identity:Array<number> = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  static create() {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  static copy(m:Array<number>) {
    return [m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7]];
  }

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

  static invTranslation(m:Array<number>) {
    m[2] = -m[2];
    m[5] = -m[5];
    return m;
  }

  static invert(m:Array<number>) {
    var a00 = m[0],
        a01 = m[1],
        a02 = m[2];
    var a10 = m[3],
        a11 = m[4],
        a12 = m[5];
    var a20 = m[6],
        a21 = m[7],
        a22 = m[8];
    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

    var det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    m[0] = b01 * det;
    m[1] = (-a22 * a01 + a02 * a21) * det;
    m[2] = (a12 * a01 - a02 * a11) * det;
    m[3] = b11 * det;
    m[4] = (a22 * a00 - a02 * a20) * det;
    m[5] = (-a12 * a00 + a02 * a10) * det;
    m[6] = b21 * det;
    m[7] = (-a21 * a00 + a01 * a20) * det;
    m[8] = (a11 * a00 - a01 * a10) * det;
    return m;
  }

  static translation(x:number, y:number):Array<number> {
    return [
      1, 0, x,
      0, 1, y,
      0, 0, 1
    ]
  }

  static scale(s:number):Array<number> {
    return [
      s, 0, 0,
      0, s, 0,
      0, 0, 1
    ];
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

  mtxMul(m:number[]) {
    return new Point3D(
      this.x * m[0] + this.y * m[1] + this.z * m[2],
      this.x * m[3] + this.y * m[4] + this.z * m[5],
      this.x * m[6] + this.y * m[7] + this.z * m[8],
    );
  }

  addScalar(num:number) {
    return new Point3D(this.x + num, this.y + num, this.z + num);
  }

  get xy():Point2D {
    return new Point2D(this.x, this.y);
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

  as3D() {
    return new Point3D(this.x, this.y, 0);
  }

  neg() {
    return new Point2D(-this.x, -this.y);
  }

  add(p:Point2D):Point2D {
    return new Point2D(this.x + p.x, this.y + p.y);
  }

  sub(p:Point2D):Point2D {
    return new Point2D(this.x - p.x, this.y - p.y);
  }

  // as3D() {
  //   return new Point3D(this.x, this.y, 0);
  // }

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

  toString() {
    return `x: ${this.x}, y: ${this.y}`;
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
    if (this.maxX < x) {
      this.maxX = x;
      return true;
    }

    if (this.minX > x) {
      this.minX = x;
      return true;
    }

    if (this.maxY < y) {
      this.maxY = y;
      return true;
    }

    if (this.minY > y) {
      this.minY = y;
      return true;
    }

    return false;
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