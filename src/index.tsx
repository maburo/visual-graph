import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Camera, Viewport } from './camera';
import Grap from './graph';
import App from './components/App';
import Graph from './graph';
import SvgRender from './svgRenderer';
import MiniMapRender from './miniMapRender';

declare global {
  interface Window { setLod: (lvl:number) => void; }
}

const graphElement = document.getElementById('graph');

const camera = new Camera(new Viewport(0, 0, 2300, 2300));

const render = new SvgRender(camera);

const graph = new Graph(graphElement, render, camera);
graph.enableMinimap = true;
graph.init();
graph.render();

ReactDOM.render (<App />, document.getElementById("app"));

let mousedown = false;
let mouseX = 0, mouseY = 0;

graphElement.addEventListener('resize', (e) => {
  console.log(e);
  
});

graphElement.addEventListener("wheel", (e) => { camera.zoom(e.deltaY) })

graphElement.addEventListener('mousedown', (e) => { 
  mousedown = true; 
  mouseX = e.x;
  mouseY = e.y;
})

graphElement.addEventListener('mouseup', (e) => { mousedown = false; })

graphElement.addEventListener('mousemove', (e) => {
  if (mousedown) {
    e.preventDefault();
    camera.move((mouseX - e.x) * 4, (mouseY - e.y) * 4);
  }
  mouseX = e.x;
  mouseY = e.y;
});

document.addEventListener('keypress', (e) => {
  switch(e.key) {
    case '-':
      camera.zoom(camera.zoomLevel + 300);
      break;
    case '+':
    case '=':
      camera.zoom(camera.zoomLevel - 300);
      break;
  }
  
});

fetch('/big_graph.json')
.then((response) => response.json())
.then((json:string) => {
  graph.create(json);
});