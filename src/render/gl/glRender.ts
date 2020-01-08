import { Renderer, AABB, Matrix3D, Point2D } from '../render';
import Graph from '../../graph';
import Node from '../../node';

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

export default class WebGlRenderer extends Renderer {
  private root:HTMLCanvasElement;
  private gl:WebGLRenderingContext;

  render(delta:number, grap:Graph) {
    this.camera.update(delta);

    const gl = this.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    grap.nodeList.forEach((n:Node) => {
      
    });
  }

  onResize(size:Point2D) {
    this.root.width = size.x;
    this.root.height = size.y;
  }

  create(graph:Graph) {

  }

  init(width:number, height:number) {
    this.root = document.createElement('canvas');
    this.gl = this.root.getContext('webgl');
    this.gl.clearColor(0.5, 0.5, 0.5, 1);
  }

  get domElement():HTMLElement {
    return this.root;
  }
}