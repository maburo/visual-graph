// import Camera from "./render/camera";
// import Graph from "./graph";
import Renderer from "./render/render";
import CommandManager from "./commands/commandMgr";

export default class GraphController {
  private element: HTMLElement;
  private cmdManager: CommandManager;

  mousedown = false;
  mouseX = 0;
  mouseY = 0;
  renderer: Renderer<unknown, unknown>;

  constructor(renderer: Renderer<unknown, unknown>, cmdManager: CommandManager) {
    this.renderer = renderer;
    this.cmdManager = cmdManager;
  }

  register(element:HTMLElement) {
    this.element = element;
    this.removeListeners();
    this.registerListeners();
  }

  private removeListeners() {
    window.removeEventListener('keydown', e => this.onKeyPress(e));
    this.element.removeEventListener('mousemove', e => this.onMouseMove(e));
    this.element.removeEventListener('mouseup', e => this.onMouseUp(e));
    this.element.removeEventListener('mousedown', e => this.onMouseDown(e));
    this.element.removeEventListener('wheel', e => this.onMouseWheel(e));
  }

  private registerListeners() {
    window.addEventListener('keydown', e => this.onKeyPress(e));
    this.element.addEventListener('mousemove', e => this.onMouseMove(e));
    this.element.addEventListener('mouseup', e => this.onMouseUp(e));
    this.element.addEventListener('mousedown', e => this.onMouseDown(e));
    this.element.addEventListener('wheel', e => this.onMouseWheel(e));
  }

  private onKeyPress(e: KeyboardEvent) {
    if (e.ctrlKey) {
      switch (e.keyCode) {
        case 90: // Z
          this.cmdManager.undo();
          break;
        case 89: // Y
          this.cmdManager.redo();
          break;
      }
    }
  }

  private onMouseDown(e:MouseEvent) {
    if (e.button !== 0) return;

    this.mousedown = true; 
    this.mouseX = e.x;
    this.mouseY = e.y;
  }

  private onMouseMove(e:MouseEvent) {
    if (e.button !== 0) return;

    if (this.mousedown) {
      e.preventDefault();
      this.renderer.camera.move(this.mouseX - e.x, this.mouseY - e.y);
    }

    this.mouseX = e.x;
    this.mouseY = e.y;
    this.renderer.onMouseMove(e.x, e.y);
  }

  private onMouseUp(e:MouseEvent) {
    if (e.button !== 0) return;
    
    this.mousedown = false;
  }

  private onMouseWheel(e:MouseWheelEvent) {
    this.renderer.camera.zoom(-e.deltaY);
  }
}