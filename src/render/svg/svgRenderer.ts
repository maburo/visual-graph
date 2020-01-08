import Camera from '../camera';
import { Renderer, Matrix3D, Point2D, AABB } from '../render';
import Graph from '../../graph';
import MiniMapRender from './miniMapRender';
import { QuadTree } from '../scene';
import Node from '../../node';
import NodeFactory from './nodeFactory';

const svgNS = "http://www.w3.org/2000/svg";

function createSvgNode(type:string, options:any) {
  const node = document.createElementNS(svgNS, type);
  Object.keys(options).forEach((key:string) => {
    node.setAttributeNS(null, key, options[key]);
  });
  return node;
}

export default class SvgRender extends Renderer {
  private svg:SVGElement;
  private container:SVGElement;
  private mousePos:Point2D = new Point2D();
  private root:HTMLElement;
  private nodes:any[] = [];
  private viewportSize:Point2D
  private qTree:QuadTree = new QuadTree(5, -5000, -5000, 5000, 5000);
  private bbox:AABB = new AABB();
  
  constructor(camera:Camera) {
    super(camera);
  }

  init(width:number, height:number) {
    this.svg = createSvgNode('svg', {});
    this.svg.style.width = '100%';
    this.svg.style.height = '100%';

    this.svg.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.container = createSvgNode('g', {});
    this.svg.appendChild(this.container);

    this.minimap = new MiniMapRender(this.camera, this.bbox, .25);
    this.minimap.init(0, 0);
    
    
    this.root = document.createElement('div');
    this.root.appendChild(this.minimap.domElement);
    this.root.appendChild(this.svg);
  }

  onMouseMove(e:MouseEvent) {
    this.mousePos = new Point2D(e.x, e.y);
  }

  onResize(size:Point2D) {
    this.root.style.width = size.x + 'px';
    this.root.style.height = size.y + 'px';
    this.viewportSize = size;
    this.minimap.onResize(size);
    this.camera.viewportSize = size;
  }

  get domElement():HTMLElement {
    return this.root;
  }

  create(graph:Graph) {
    const factory:NodeFactory = new NodeFactory();
    
    graph.nodeList.forEach(node => {
      const svgNode = factory.create(node.data);
      
      this.container.appendChild(svgNode);
      this.bbox.addPoint(node.x, node.y);
      this.nodes.push({svgNode, id: node.id, x: node.x, y: node.y});
  
      graph.adjecensyMap.outcoming(node.id)
      .forEach(edge => {
        const target = graph.getNode(edge.target);
        const line = createSvgNode('line', {
          x1: node.x, y1: node.y, 
          x2: target.x, y2: target.y,
          style: 'stroke:black;stroke-width:1'
        });
        this.container.append(line);
      });
    });

    const side = Math.max(this.bbox.width, this.bbox.height) * .75;
    const c = this.bbox.center;
    this.qTree = new QuadTree(5, c.x - side, c.y - side, c.y + side, c.y + side);
    this.nodes.forEach(node => this.qTree.add(node));
   
    this.container.appendChild(createSvgNode('circle', {
      cx: this.bbox.center.x,
      cy: this.bbox.center.y,
      fill: 'red',
      r: '10'
    }))

    this.container.appendChild(createSvgNode('circle', {
      cx: 0,
      cy: 0,
      fill: 'green',
      r: '10'
    }))

    this.container.appendChild(createSvgNode('rect', {
      x: this.bbox.minX,
      y: this.bbox.minY,
      width: this.bbox.width,
      height: this.bbox.height,
      fill: 'none',
      stroke: 'black'
    }))

    this.minimap.create(graph);

    // this.renderQTree(this.qTree);
  }

  renderQTree(qTree:QuadTree) {
    const svg = createSvgNode('rect', {
      x: qTree.minX,
      y: qTree.minY,
      width: qTree.maxX - qTree.minX,
      height: qTree.maxY - qTree.minY,
      style: 'fill:none;stroke:blue;stroke-width:5'
    });

    if (qTree.isDivided) {
      this.renderQTree(qTree.nw);
      this.renderQTree(qTree.ne);
      this.renderQTree(qTree.sw);
      this.renderQTree(qTree.se);
    }

    this.container.appendChild(svg);
  }

  /**
   * a  c  e | 0 1 2
   * b  d  f | 3 4 5
   * 0  0  1 | 6 7 8
   */
  render(delta:number, graph:Graph) {
    const trMtx = this.camera.translationMtx;
    const scaleMtx = this.camera.scaleMtx;
    const vpMtx = this.camera.viewportMtx;
    const invVpMtx = [1, 0, vpMtx[2], 0, 1, vpMtx[5], 0, 0, 1];
   
    this.camera.update(delta);
  
    let mouseViewportPos = this.mousePos.sub(this.viewportSize.div(2));
    let mouseWorldCoord = new Point2D(
      this.camera.postion.x + mouseViewportPos.x / this.camera.postion.z,
      this.camera.postion.y + mouseViewportPos.y / this.camera.postion.z);
    let mouseMtx = mouseWorldCoord.translation;
    
    let m = Matrix3D.identity;
    
    m = Matrix3D.mul(vpMtx, scaleMtx)
    m = Matrix3D.mul(m, invVpMtx)
    m = Matrix3D.mul(m, trMtx);
    const matrix = `matrix(${m[0]},${m[3]},${m[1]},${m[4]},${m[2]},${m[5]})`;
    this.container.setAttributeNS(null, 'transform', matrix);

    if (this.enableMinimap) {
      this.minimap.render(delta, graph);
    }
  }
}