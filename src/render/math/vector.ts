export class Vector2D {
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
    return new Vector3D(this.x, this.y, 1);
  }

  neg() {
    return new Vector2D(-this.x, -this.y);
  }

  add(p:Vector2D):Vector2D {
    return new Vector2D(this.x + p.x, this.y + p.y);
  }

  sub(p:Vector2D):Vector2D {
    return new Vector2D(this.x - p.x, this.y - p.y);
  }

  // as3D() {
  //   return new Vector3D(this.x, this.y, 0);
  // }

  div(num:number) {
    return new Vector2D(this.x / num, this.y / num);
  }

  mul(num:number) {
    return new Vector2D(this.x * num, this.y * num);
  }

  get translation() {
    return [
      1, 0, this.x,
      0, 1, this.y,
      0, 0, 1
    ]
  }

  toString() {
    return `[x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}]`;
  }
}

export class Vector3D {
  readonly x:number;
  readonly y:number;
  readonly z:number;

  constructor(x:number = 0, y:number = 0, z:number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(p: Vector3D) {
    return new Vector3D(this.x + p.x, this.y + p.y, this.z + p.z);
  }

  sub(p: Vector3D) {
    return new Vector3D(this.x - p.x, this.y - p.y, this.z - p.z);
  }

  mul(num:number) {
    return new Vector3D(this.x * num, this.y * num, this.z * num);
  }

  mtxMul(m:number[]) {
    return new Vector3D(
      this.x * m[0] + this.y * m[1] + this.z * m[2],
      this.x * m[3] + this.y * m[4] + this.z * m[5],
      this.x * m[6] + this.y * m[7] + this.z * m[8],
    );
  }

  addScalar(num:number) {
    return new Vector3D(this.x + num, this.y + num, this.z + num);
  }

  get xy():Vector2D {
    return new Vector2D(this.x, this.y);
  }

  get translationMtx() {
    return [
      1, 0, -this.x,
      0, 1, -this.y,
      0, 0, 1
    ];
  }

  toString() {
    return `[x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}, z: ${this.z.toFixed(2)}]`;
  }
}