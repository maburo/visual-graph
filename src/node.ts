/**
 * Node
 */

import AABB from "./render/math/aabb";

// export default interface Node {
//   id: string;
// }
export default class Node<T> {
  readonly id: string;
  readonly data: T;

  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  
  constructor(id: string, data: T, x:number = 0, y:number = 0) {
    this.id = id;
    this.data = data;
    this.x = x;
    this.y = y;
  }
}