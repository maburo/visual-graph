/**
 * Node
 */
export default class Node {
  readonly id:string;
  readonly x:number;
  readonly y:number;
  readonly type:string;
  readonly data:any;
  
  constructor(id: string, type:string, data:any, x:number = 0, y:number = 0) {
    this.id = id;
    this.type = type;
    this.data = data;
    this.x = x;
    this.y = y;
  }
}