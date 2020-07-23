// import Camera from '../camera';
// import Renderer from '../render';
// import Graph from '../../graph';
// // import MiniMapRender from './miniMapRender';
// import Node from '../../node';
// import NodeFactory from './nodeFactory';
// import { ElementFactory } from '../html/htmlElementFactory';
// import AABB from '../math/aabb';
// import { Point2D, Point3D } from '../math/point';
// import { Matrix3D } from '../math/matrix';

// const svgNS = "http://www.w3.org/2000/svg";

// function createSvgNode(type:string, options:any) {
//   const node = document.createElementNS(svgNS, type);
//   Object.keys(options).forEach((key:string) => {
//     node.setAttributeNS(null, key, options[key]);
//   });
//   return node;
// }

// export default class SvgRender<T> extends Renderer<T, SVGElement> {
//   private svg:SVGSVGElement;
//   private container:SVGGraphicsElement;
//   private mousePos:Point2D = new Point2D();
//   private nodes:any[] = [];
//   // private viewportSize:Point2D
  
//   constructor(graph: Graph<T>, elementFactory: ElementFactory<T, SVGElement>, camera: Camera) {
//     super(graph, camera, elementFactory, document.createElement('div'));
//     camera.zoomSense = 0.001;
//   }

//   init(width:number, height:number) {
//     this.svg = createSvgNode('svg', {}) as SVGSVGElement;
//     this.svg.style.width = '100%';
//     this.svg.style.height = '100%';

//     // this.svg.addEventListener('mousemove', (e) => this.onMouseMove(e));

//     this.container = createSvgNode('g', {}) as SVGGraphicsElement;
//     this.svg.appendChild(this.container);

//     // this.minimap = new MiniMapRender(this.camera, this.bbox, .25);
//     // this.minimap.init(0, 0);
        
//     // this.root.appendChild(this.minimap.domElement);
//     this.root.appendChild(this.svg);
//   }

//   onMouseMove(x:number, y:number) {
//     this.mousePos = new Point2D(x, y);
//   }

//   onResize(size:Point2D) {
//     this.root.style.width = size.x + 'px';
//     this.root.style.height = size.y + 'px';
//     // this.viewportSize = size;
//     // this.minimap.onResize(size);
//     this.camera.viewportSize = size;
//   }

//   get domElement():HTMLElement {
//     return this.root;
//   }

//   addNode(node: Node<T>) {
//     const el = this.elementFactory.create(node, 1);
//     el.style.left = node.x + 'px';
//     el.style.top = node.y + 'px';
//     this.container.appendChild(el);
//   }

//   removeNode() {

//   }

//   invMtx:number[] = Matrix3D.identity;

//   /**
//    * a  c  e | 0 1 2
//    * b  d  f | 3 4 5
//    * 0  0  1 | 6 7 8
//    */
//   draw(delta: number, grap: Graph<unknown>): void {
//     const trMtx = this.camera.translationMtx;
//     const scaleMtx = this.camera.scaleMtx;

//     const mp = this.mousePos
//     // .sub(this.camera.viewportSize.div(2))
//     .div(this.camera.zoomLevel)
//     .add(this.camera.postion.xy)
    

//     const z = this.camera.zoomLevel;
//     const hvp = this.camera.viewportSize.div(2);
  
//     let m = Matrix3D.identity;
//     if (this.zoomToCursor) {

//     } else {
//       // const mm = new Point3D(this.mousePos.x, this.mousePos.y)
      
//       m = Matrix3D.mul(m, Matrix3D.translation(hvp.x, hvp.y));
//       m = Matrix3D.mul(m, this.camera.scaleMtx);
//       m = Matrix3D.mul(m, Matrix3D.translation(-hvp.x, -hvp.y));
//       m = Matrix3D.mul(m, this.camera.translationMtx);
//       m = Matrix3D.mul(m, Matrix3D.translation(hvp.x, hvp.y));

//       // this.invMtx = Matrix3D.copy(m)
//     }

//     if (this.mouseScreenPos) {
//       const rect = this.domElement.getBoundingClientRect()
//       const x = this.mousePos.x;
//       const y = this.mousePos.y;

//       // let mm = Matrix3D.identity;
//       // mm = Matrix3D.mul(m, Matrix3D.translation(-hvp.x, -hvp.y));
//       // m = Matrix3D.mul(m, this.camera.scaleMtx);
//       // m = Matrix3D.mul(m, Matrix3D.translation(-hvp.x, -hvp.y));
//       // m = Matrix3D.mul(m, this.camera.translationMtx);
//       // m = Matrix3D.mul(m, Matrix3D.translation(hvp.x, hvp.y));

//       // let msp = new Point2D(x, y)
//       // console.log('offset', msp);      
//       // msp = msp.add(hvp.neg())
//       // console.log('vp', msp);
//       // msp = msp.add(this.camera.postion.xy)
//       // console.log('tr', msp);
//       // msp = msp.mul(1 / this.camera.zoomLevel)
//       // console.log('scaled', msp);
//       var pt:SVGPoint = this.svg.createSVGPoint();
//       pt.x = x;
//       pt.y = y;
//       const svgMtx = this.container.getScreenCTM().inverse();
//       pt = pt.matrixTransform(svgMtx)

//       this.mouseScreenPos(pt.x, pt.y);
//     }
    
//     this.container.setAttributeNS(null, 'transform', Matrix3D.cssMatrix(m));

//     if (this.enableMinimap) {
//       // this.minimap.render(delta, graph);
//     }
//   }

//   toLocalCoordinates(x: number, y: number): Point3D {
//     var pt:SVGPoint = this.svg.createSVGPoint();
//     pt.x = x;
//     pt.y = y;
//     const svgMtx = this.container.getScreenCTM().inverse();
//     pt = pt.matrixTransform(svgMtx)
//     return new Point3D(pt.x, pt.y, pt.z);
//   }

//   create(graph: Graph<T>) {
//     const factory:NodeFactory = new NodeFactory();
    
//     graph.nodeList.forEach(node => {
//       const svgNode = factory.create(node.data);
      
//       this.container.appendChild(svgNode);
//       this.bbox.addPoint(node.x, node.y);
//       this.nodes.push({svgNode, id: node.id, x: node.x, y: node.y});
  
//       graph.adjecensyMap.outcoming(node.id)
//       .forEach(edge => {
//         const target = graph.getNode(edge.target);
//         const line = createSvgNode('line', {
//           x1: node.x, y1: node.y, 
//           x2: target.x, y2: target.y,
//           style: 'stroke:black;stroke-width:1'
//         });
//         this.container.append(line);
//       });
//     });

//     const side = Math.max(this.bbox.width, this.bbox.height) * .75;
//     const c = this.bbox.center;

//     this.container.appendChild(createSvgNode('circle', {
//       cx: this.bbox.center.x,
//       cy: this.bbox.center.y,
//       fill: 'red',
//       r: '10'
//     }))

//     this.container.appendChild(createSvgNode('circle', {
//       cx: 0,
//       cy: 0,
//       fill: 'green',
//       r: '10'
//     }))

//     this.container.appendChild(createSvgNode('line', {
//       x1: -100,
//       y1: 0,
//       x2: 100,
//       y2: 0,
//       style: 'stroke:rgb(255,0,0);stroke-width:1'
//     }));

//     this.container.appendChild(createSvgNode('line', {
//       x1: 0,
//       y1: -100,
//       x2: 0,
//       y2: 100,
//       style: 'stroke:rgb(255,0,0);stroke-width:1'
//     }));

//     this.container.appendChild(createSvgNode('circle', {
//       cx: 300,
//       cy: 300,
//       fill: 'green',
//       r: '10'
//     }))

//     this.container.appendChild(createSvgNode('circle', {
//       cx: 600,
//       cy: 600,
//       fill: 'green',
//       r: '10'
//     }))

//     this.container.appendChild(createSvgNode('rect', {
//       x: this.bbox.minX,
//       y: this.bbox.minY,
//       width: this.bbox.width,
//       height: this.bbox.height,
//       fill: 'none',
//       stroke: 'black'
//     }))

//     // this.minimap.create(graph);

//     // this.renderQTree(this.qTree);
//   }  
// }