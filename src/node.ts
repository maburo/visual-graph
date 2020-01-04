/**
 * Node
 */
export default class Node {
  readonly id:string;
  readonly x:number;
  readonly y:number;
  
  constructor(id: string, x:number = 0, y:number = 0) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}