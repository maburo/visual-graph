import Camera from './render/camera';
import Graph from './graph';
// import SvgRender from './render/svg/svgRenderer';
// import HtmlRenderer from './render/html/htmlRenderer';
// import WebGlRenderer from './render/gl/glRender';
import './styles/dev.scss'
import './styles/style.scss'
import GraphController from './graphController';

import App from './components/App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CommandManager from './commands/commandMgr';

ReactDOM.render(<App cmdManager={new CommandManager()} />, document.getElementById('app'));

// const graphElement = document.getElementById('graph');

// const camera = new Camera();
// const svgRender = new SvgRender(camera);
// const htmlRenderer = new HtmlRender(camera);
// const graph = new Graph(graphElement);
// graph.renderer = htmlRenderer;
// graph.render();

// graph.renderer.freeCamera = false;
// const controller = new GraphController(camera);
// controller.graph = graph;
// controller.register(graph.renderer.domElement);

// const menu = new ContextMenu();
// menu.register();
// menu.addMenuItem('item 1');
// menu.addMenuItem('item 2');



// const px = document.getElementById('px');
// const py = document.getElementById('py');
// const pz = document.getElementById('pz');

// const mx = document.getElementById('mx');
// const my = document.getElementById('my');

// graph.renderer.mouseScreenPos = (x:number, y:number) => {
//   mx.innerHTML = 'X: ' + x.toFixed(0);
//   my.innerHTML = 'Y: ' + y.toFixed(0);
// }

// camera.onMove = (x:number, y:number) => {
//   px.innerHTML = 'X: ' + x.toFixed(2);
//   py.innerHTML = 'Y: ' + y.toFixed(2);
// }

// camera.onZoom = (z:number) => {
//   pz.innerHTML = 'Z: ' + z.toFixed(2);
// }

// // fetch('/big_graph.json')
// // .then((response) => response.json())
// // .then((json:string) => {
// //   graph.create(json);

// //   console.log(camera.bbox);
  
// // });

// (window as any).changeRender = (value:string) => {
//   switch (value) {
//     case 'svg':
//       graph.renderer = new SvgRender(camera);
//       break;
//     case 'html':
//       graph.renderer = new HtmlRenderer(camera);
//       break;
//     case 'webgl':
//       graph.renderer = new WebGlRenderer(camera);
//       break;
//   }
// }

// (window as any).changeZoomMode = (value:string) => {
//   switch (value) {
//     case 'center':
//       graph.renderer.zoomToCursor = false;
//       break;
//     case 'mouse':
//       graph.renderer.zoomToCursor = true;
//       break;
//   }
// }