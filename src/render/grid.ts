import AABB from './math/aabb';

interface Node {
  x:number;
  y:number;
}

interface Cell {
  nodes:Node[];
}

export default class Grid {
  private readonly cellSize = 300;
  private cells:Array<Cell> = [];
  private aabb:AABB = new AABB();

  addNode(x:number, y:number) {
    if (this.aabb.addPoint(x, y)) {
      this.resize();
    }
  }

  contains(aabb:AABB) {

  }

  containsCells(aabb:AABB) {

  }

  private resize() {
    // const maxDimension = Math.max(this.aabb.width, this.aabb.height);
    // const size = Math.ceil(maxDimension / this.cellSize);
    
    // this.cells = this.cells.reduce((acc, cell) => {
    //   cell.nodes.forEach(node => {
    //     const x = Math.floor(node.x / this.cellSize);
    //     const y = Math.floor(node.y / this.cellSize);
    //   })
    //   return acc;
    // }, new Array<Cell>(size * size));

    // const arr = new Array<Cell>(size * size);
    // this.cells.forEach(node => {
    //   const x = Math.floor(node.x / this.cellSize);
    //   const y = Math.floor(node.y / this.cellSize);
    //   arr[x + y * size].nodes.push();
    // });
  }
}