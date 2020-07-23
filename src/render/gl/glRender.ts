import Node from '../../node';
import AABB from '../math/aabb';
import { Point2D, Point3D } from '../math/point';
import { Matrix3D } from '../math/matrix';
import Graph from '../../graph';
import Renderer from '../render';
import Camera from '../camera';

function loadShader(gl:WebGLRenderingContext, type:number, source:string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader', gl.getShaderInfoLog(shader), source);
      gl.deleteShader(shader);
      return 0;
  }

  return shader;
}

function initShaderProgram(gl:WebGLRenderingContext, vsSrc:string, fsSrc:string) {
  const program = gl.createProgram();
  const vertex = loadShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fragment = loadShader(gl, gl.FRAGMENT_SHADER, fsSrc);

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to init shader', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
  }

  return program;
}

function createShaderProgram(name:string, vsSrc:string, fsSrc:string) {
  if (!this.shaders[name]) {
    this.shaders[name] = this.initShaderProgram(vsSrc, fsSrc);
  }

  return this.shaders[name];
}

export default class WebGlRenderer<T> extends Renderer<T, HTMLElement> {
  private container:HTMLCanvasElement;
  private gl:WebGLRenderingContext;

  constructor(graph: Graph<T>, camera: Camera) {
    super(graph, camera, null);
    this.container = document.createElement('canvas');
    this.gl = this.container.getContext('webgl');
    camera.zoomSense = 0.0001;
  }

  onMouseMove(x:number, y:number) {
  }

  draw(delta: number, grap: Graph<unknown>): void {
    this.camera.update(delta);

    const gl = this.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    grap.nodeList.forEach((n: Node<T>) => {
      
    });
  }

  toLocalCoordinates(x: number, y: number): Point3D {
    return new Point3D();
  }

  addNode(node: Node<T>) {
  }

  removeNode(id: string) {
  }

  onResize(width: number, height: number) {
    this.container.width = width;
    this.container.height = height;
  }

  init(): void {
    this.gl.clearColor(0.5, 0.5, 0.5, 1);
  }

  get domElement():HTMLElement {
    return this.container;
  }

  update(): void {
    
  }
}