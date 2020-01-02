import { Viewport, Camera } from './camera';
import { Render, BBox } from './render';
import Node from './node';

const svgNS = "http://www.w3.org/2000/svg";

function createSvgNode(type:string, options:any) {
  const node = document.createElementNS(svgNS, type);
  Object.keys(options).forEach((key:string) => {
    node.setAttributeNS(null, key, options[key]);
  });
  return node;
}

export default class SvgRender extends Render {
  private root:SVGElement;
  bbox:BBox;

  constructor(camera:Camera) {
    super(camera);
  }

  init(width:number, height:number) {
    this.root = createSvgNode('svg', {});
    this.root.style.width = '100%';
    this.root.style.height = '100%';

    this.render();
  }

  onResize(x:number, y:number) {

  }

  get domElement():HTMLElement {
    return (this.root as unknown) as HTMLElement;
  }

  setViewport(viewport:Viewport) {
    this.root.setAttributeNS(null, 'viewBox', viewport.toString());
  }

  private set viewport(viewport:Viewport) {
    this.root.setAttributeNS(null, 'viewBox', viewport.toString());
  }

  createNode(el:any):Node {
    const group = createSvgNode('g', {
      transform: `translate(${el.diagramX}, ${el.diagramY})`
    });

    const node = createSvgNode('rect', {
      width: 30,
      height: 30,
      fill: 'black'
    });
    
    const text = createSvgNode('text', {});
    text.style.fontSize = '24px';
    text.appendChild(document.createTextNode(el.type))
    
    group.appendChild(node);
    group.appendChild(text);

    this.root.appendChild(group);

    return new Node(el.diagramX, el.diagramY);
  }

  render() {
    this.viewport = this.camera.viewport;
  }
}