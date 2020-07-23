export class Matrix3D {
  static identity() {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  } 

  static copy(m:Array<number>) {
    return [m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]];
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

  static cssMatrix(m: Array<number>) {
    return `matrix(${m[0]},${m[3]},${m[1]},${m[4]},${m[2]},${m[5]})`;
  }
}