import AABB from "./math/aabb";

interface Node {
  x:number;
  y:number;
}

export class QuadTree {
  readonly children:Node[] = [];
  readonly capacity:number;
  readonly minX:number = 0;
  readonly minY:number = 0;
  readonly maxX:number = 0;
  readonly maxY:number = 0;

  nw:QuadTree;
  ne:QuadTree;
  sw:QuadTree;
  se:QuadTree;
  private divided:boolean = false;

  constructor(capacity:number, minX:number, minY:number, maxX:number, maxY:number) {
    this.capacity = capacity;
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  get isDivided() {
    return this.divided;
  }

  add(node:Node) {
    if (!this.contains(node.x, node.y)) return false;

    if (this.children.push(node) > this.capacity) {
      if (!this.divided) this.subdivide();

      this.children.forEach(it => this.nw.add(it) || this.ne.add(it) || 
                                  this.sw.add(it) || this.se.add(it));

      // if (this.nw.contains(it.x, it.y)) this.nw.add(it);
      // else if (this.ne.contains(it.x, it.y)) this.ne.add(it);
      // else if (this.sw.contains(it.x, it.y)) this.sw.add(it);
      // else if (this.se.contains(it.x, it.y)) this.se.add(it);

      this.children.length = 0;
    }
    
    return true;
  }

  query(bbox:AABB, result:Array<Node>) {
    if (!this.intersects(bbox)) return false;

    if (this.divided) {
      this.nw.query(bbox, result);
      this.ne.query(bbox, result);
      this.sw.query(bbox, result);
      this.ne.query(bbox, result);
    } else {
      this.children.filter(it => bbox.contains(it.x, it.y))
                   .forEach(it => result.push(it));
    }
  }

  intersects(bbox:AABB) {
    return !(this.minX > bbox.maxX
          || this.maxX < bbox.minX
          || this.minY > bbox.maxY
          || this.maxY < bbox.minY);
  }

  contains(x:number, y:number):boolean {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }

  subdivide() {
    const centerX = this.minX + (this.maxX - this.minX) / 2;
    const centerY = this.minY + (this.maxY - this.minY) / 2;

    this.nw = new QuadTree(this.capacity, 
      this.minX, this.minY, centerX, centerY);

    this.ne = new QuadTree(this.capacity,
      centerX, this.minY, this.maxX, centerY);

    this.sw = new QuadTree(this.capacity,
      this.minX, centerY, centerX, this.maxY);

    this.se = new QuadTree(this.capacity,
      centerX, centerY, this.maxX, this.maxY);

    this.divided = true;
  }
}