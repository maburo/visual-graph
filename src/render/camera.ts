import { clamp, AABB, Point2D, Point3D } from "./render";

export default class Camera {
  private x:number = 0;
  private y:number = 0;
  private z:number = 1;
  maxZoom = 4;
  minZoom = 0.05;
  zoomSense:number = 0.001;
  isDirty = true;
  bbox:AABB;
  viewportSize:Point2D = new Point2D();

  onMove:(x:number, y:number) => void;
  onZoom:(z:number) => void;

  move(x: number, y:number) {
    if (this.bbox) {
      this.x = clamp(this.x + x * (1 / this.z), this.bbox.minX, this.bbox.maxX);
      this.y = clamp(this.y + y * (1 / this.z), this.bbox.minY, this.bbox.maxY);
    } else {
      this.x += x * (1 / this.z);
      this.y += y * (1 / this.z);
    }

    if (this.onMove) this.onMove(this.x, this.y);

    this.isDirty = true;
  }

  zoom(value:number, center?:Point2D) {
    this.z = clamp(this.z + value * this.zoomSense, this.minZoom, this.maxZoom);

    if (this.onZoom) this.onZoom(this.z);

    this.isDirty = true;
  }

  get translationMtx() {
    return [
      1, 0, -this.x,// - this.viewportSize.x * .5,
      0, 1, -this.y,// - this.viewportSize.y * .5,
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

  get viewportMtx() {
    return [
      1, 0, this.viewportSize.x * .5,
      0, 1, this.viewportSize.y * .5,
      0, 0, 1
    ];
  }

  get postion():Point3D {
    return new Point3D(this.x, this.y, this.z);
  }
  
  get zoomLevel() {
    return this.z;
  }

  update(delta:number):boolean {
    if (this.isDirty) {
      this.isDirty = false;
      return true;
    }

    return false;
  }
}