import { Command } from './commandMgr';
import Graph from '../graph';
import Node from '../node';

export default class AddElementCmd<T> implements Command {
  readonly graph: Graph<T>;
  readonly nodeId: string;
  readonly mouseX: number; 
  readonly mouseY: number;
  readonly nodeData: T;

  constructor(graph: Graph<T>, id: string, mouseX: number, mouseY: number, data: T) {
    this.nodeId = id;
    this.graph = graph;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.nodeData = data;
  }

  execute() {
    this.graph.addNode(new Node(this.nodeId, this.nodeData,  this.mouseX, this.mouseY));
  }

  undo() {
    this.graph.removeNode(this.nodeId);
  }
}