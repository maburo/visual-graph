import { Vector3D } from './math/vector';
import { Matrix3D } from './math/matrix';

describe('calculate', function() {
  it('add', function() {
    const pos = new Vector3D(4, 4, 1)

    const trMtx = Matrix3D.translation(-5, -2)
    const scaleMtx = Matrix3D.scale(.5)
    
    var mtx = Matrix3D.identity()
    Matrix3D.mul(mtx, scaleMtx)
    Matrix3D.mul(mtx, trMtx)
    pos.mtxMul(mtx).toString()
    
  });
});