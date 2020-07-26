import { clamp } from "./render";
import { Vector2D, Vector3D } from "./math/vector";
import AABB from "./math/aabb";

export default class Camera {
  private x:number = 0;
  private y:number = 0;
  private z:number = 1;
  maxZoom = 4;
  minZoom = 0.05;
  zoomSense:number = 0.001;
  isDirty = true;
  zooming = false;
  bbox:AABB;
  viewportSize:Vector2D = new Vector2D();

  onMove:(x:number, y:number) => void;
  onZoom:(z:number) => void;

  move(x: number, y:number) {
    this.x += x * (1 / this.z);
    this.y += y * (1 / this.z);

    // if (this.bbox) {
    //   this.x = clamp(this.x, this.bbox.minX, this.bbox.maxX);
    //   this.y = clamp(this.y, this.bbox.minY, this.bbox.maxY);
    // }

    if (this.onMove) this.onMove(this.x, this.y);

    this.isDirty = true;
  }

  zoom(value:number, center?:Vector2D) {
    this.z = clamp(this.z + value * this.zoomSense, this.minZoom, this.maxZoom);

    if (this.onZoom) this.onZoom(this.z);

    this.isDirty = true;
    this.zooming = true;
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

  get postion():Vector3D {
    return new Vector3D(this.x, this.y, this.z);
  }

  set position(p: Vector3D) {
    this.x = p.x; this.y = p.y; this.z = p.z;
  }

  setPosition(x: number, y: number) {
    this.x = x; this.y = y;
  }
  
  get zoomLevel() {
    return this.z;
  }

  set zoomLevel(value: number) {
    this.z = value;
  }

  update(delta:number):boolean {
    this.zooming = false;

    if (this.isDirty) {
      this.isDirty = false;
      return true;
    }

    return false;
  }
}