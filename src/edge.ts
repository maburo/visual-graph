export enum EdgeType {
  out, in
}

interface IEdgeMap {
  [id: string]: Edge[];
}

export class EdgeMap {
  private map:IEdgeMap = {}

  add(id:string, edge:Edge) {
    let edges:Edge[] = this.map[id];
    if (!edges) {
      edges = this.map[id] = [];
    }
    edges.push(edge);
  }
}

export default class Edge {
  readonly target:any;
  readonly type:EdgeType;

  constructor(target:any, type:EdgeType) {
    this.target = target;
    this.type = type;
  }
}