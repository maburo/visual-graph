import { clamp, BBox, Point2D, Point3D } from "./render";

export class Viewport {
  top:number = 0;
  left:number = 0;
  width:number = 0;
  height:number = 0;

  constructor(top:number = 0, left:number = 0, width:number = 0, height:number = 0) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
  }

  toString() {
    return `${this.top} ${this.left} ${this.width} ${this.height}`;
  }
}

export class Camera {
  private x:number = 0;
  private y:number = 0;
  private z:number = 1;
  maxZoom = 1;
  minZoom = 0.05;
  zoomSense:number = 0.001;
  isDirty = true;
  readonly viewport:Viewport;
  bbox:BBox;
  size:Point2D = new Point2D();

  constructor(viewport?:Viewport) {
    this.viewport = viewport;
  }

  move(x: number, y:number) {
    if (this.bbox) {
      this.x = clamp(this.x + x * (1 / this.z), this.bbox.min.x, this.bbox.max.x);
      this.y = clamp(this.y + y * (1 / this.z), this.bbox.min.y, this.bbox.max.y);
    } else {
      this.x += x * this.z;
      this.y += y * this.z;
    }

    this.isDirty = true;
  }

  zoom(value:number, center?:Point2D) {
    this.z = clamp(this.z + value * this.zoomSense, this.minZoom, this.maxZoom);
    this.isDirty = true;
  }

  get translationMtx() {
    return [
      1, 0, -this.x,
      0, 1, -this.y,
      0, 0, 1
    ];
  }

  get scaleMtx() {
    return [
      this.z, 0, 0,
      0, this.z, 0,
      0, 0, 1
    ];
  }

  get postion():Point3D {
    return new Point3D(this.x, this.y, this.z);
  }

  // setPosition(x:number, y:number) {
  //   this.isDirty = true;
  // }

  // setZoom(value:number, center?:Point) {
  //   this.isDirty = true;
  // }
  
  get zoomLevel() {
    return this.z;
  }

  update():boolean {
    if (this.isDirty) {
      const width = this.size.x * this.z;
      const height = this.size.y * this.z;
      
      this.viewport.top = this.x - width / 2;
      this.viewport.left = this.y - height / 2;
      this.viewport.width = clamp(width, 100, 15000);
      this.viewport.height = clamp(height, 100, 15000);

      this.isDirty = false;
      return true;
    }

    return false;
  }
}