import { Viewport, Camera } from './camera';
import { Render, BBox, Matrix3D } from './render';
import Node from './node';
import Graph from './graph';

const svgNS = "http://www.w3.org/2000/svg";

function createSvgNode(type:string, options:any) {
  const node = document.createElementNS(svgNS, type);
  Object.keys(options).forEach((key:string) => {
    node.setAttributeNS(null, key, options[key]);
  });
  return node;
}

export default class SvgRender extends Render {
  private svg:SVGElement;
  private container:SVGElement;

  bbox:BBox;

  constructor(camera:Camera) {
    super(camera);
  }

  init(width:number, height:number) {
    this.svg = createSvgNode('svg', {});
    this.svg.style.width = '100%';
    this.svg.style.height = '100%';

    this.container = createSvgNode('g', {});
    this.svg.appendChild(this.container);

    this.render();
  }

  onResize(x:number, y:number) {

  }

  get domElement():HTMLElement {
    return (this.svg as unknown) as HTMLElement;
  }

  // setViewport(viewport:Viewport) {
  //   this.svg.setAttributeNS(null, 'viewBox', viewport.toString());
  // }

  // private set viewport(viewport:Viewport) {
  //   this.svg.setAttributeNS(null, 'viewBox', viewport.toString());
  // }

  create(graph:Graph) {
    graph.nodeList.forEach((node:Node) => {
      const group = createSvgNode('g', {
        transform: `translate(${node.x}, ${node.y})`
      });
  
      const svgNode = createSvgNode('rect', {
        width: 30,
        height: 30,
        fill: 'black'
      });
      
      const text = createSvgNode('text', {});
      text.style.fontSize = '24px';
      text.appendChild(document.createTextNode(node.id))

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
      
      group.appendChild(svgNode);
      group.appendChild(text);
  
      this.container.appendChild(group);
    });

    this.container.appendChild(createSvgNode('circle', {
      cx: graph.bbox.center.x,
      cy: graph.bbox.center.y,
      fill: 'red',
      r: '30'
    }))

    this.container.appendChild(createSvgNode('circle', {
      cx: 0,
      cy: 0,
      fill: 'red',
      r: '30'
    }))
  }

  /**
   * a  c  e | 0 1 2
   * b  d  f | 3 4 5
   * 0  0  1 | 6 7 8
   */
  render() {
    const pos = this.camera.postion;
    const trMtx = this.camera.translationMtx;
    const scaleMtx = this.camera.scaleMtx;

    const vpT = Matrix3D.translationMtx(window.innerWidth / 2, 
                            window.innerHeight / 2)
    const vpR = Matrix3D.translationMtx(- window.innerWidth / 2, 
                              - window.innerHeight / 2)

    let m = Matrix3D.mul(trMtx, scaleMtx);
    m = Matrix3D.mul(vpT, scaleMtx)
    m = Matrix3D.mul(m, vpR);
    m = Matrix3D.mul(m, trMtx)
    // m = Matrix3D.mul(m, trMtx)
    // m = Matrix3D.mul(vpT, trMtx)
    // const matrix = `matrix(${pos.z},0,0,${pos.z},${-pos.x},${-pos.y})`;
    const matrix = `matrix(${m[0]},${m[3]},${m[1]},${m[4]},${m[2]},${m[5]})`;
    this.container.setAttributeNS(null, 'transform', matrix);
  }
}