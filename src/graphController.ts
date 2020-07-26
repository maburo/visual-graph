import Camera from "./render/camera";
import Graph from "./graph";

export default class GraphController {
  private element:HTMLElement;
  private readonly camera:Camera;
  mousedown = false;
  mouseX = 0;
  mouseY = 0;
  graph:Graph;

  constructor(camera:Camera) {
    this.camera = camera;
  }

  register(element:HTMLElement) {
    this.element = element;
    this.removeListeners();
    this.registerListeners();
  }

  private removeListeners() {
    this.element.removeEventListener('mousemove', e => this.onMouseMove(e));
    this.element.removeEventListener('mouseup', e => this.onMouseUp(e));
    this.element.removeEventListener('mousedown', e => this.onMouseDown(e));
    this.element.removeEventListener('wheel', e => this.onMouseWheel(e));
  }

  private registerListeners() {
    this.element.addEventListener('mousemove', e => this.onMouseMove(e));
    this.element.addEventListener('mouseup', e => this.onMouseUp(e));
    this.element.addEventListener('mousedown', e => this.onMouseDown(e));
    this.element.addEventListener('wheel', e => this.onMouseWheel(e));
  }

  private onMouseMove(e:MouseEvent) {
    if (this.mousedown) {
      e.preventDefault();
      
      this.camera.move(this.mouseX - e.x, this.mouseY - e.y);
    }
    this.mouseX = e.x;
    this.mouseY = e.y;
    this.graph.renderer?.onMouseMove(e.clientX, e.clientY);
  }

  private onMouseUp(e:MouseEvent) {
    this.mousedown = false;
  }

  private onMouseDown(e:MouseEvent) {
    this.mousedown = true; 
    this.mouseX = e.x;
    this.mouseY = e.y;
  }

  private onMouseWheel(e:MouseWheelEvent) {
    this.camera.zoom(-e.deltaY) 
  }
}