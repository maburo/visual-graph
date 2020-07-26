import { Vector2D } from './vector';

/**
 * Axis aligned bounding box
 */
export default class AABB {
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

  get center():Vector2D {
    return new Vector2D(this.minX + this.width / 2,
                       this.minY + this.height / 2);
  }
}