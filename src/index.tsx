import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Camera from './render/camera';
import App from './components/App';
import Graph from './graph';
import SvgRender from './render/svg/svgRenderer';
import WebGlRenderer from './render/gl/glRender';
import './styles/style.scss'

declare global {
  interface Window { setLod: (lvl:number) => void; }
}

const graphElement = document.getElementById('graph');

const camera = new Camera();
const render = new SvgRender(camera);
const graph = new Graph(graphElement);
graph.renderer = render;
graph.render();

// ReactDOM.render (<App />, document.getElementById("app"));

let mousedown = false;
let mouseX = 0, mouseY = 0;

graphElement.addEventListener("wheel", (e) => { camera.zoom(-e.deltaY) })

graphElement.addEventListener('mousedown', (e) => { 
  mousedown = true; 
  mouseX = e.x;
  mouseY = e.y;
})

graphElement.addEventListener('mouseup', (e) => { mousedown = false; })

graphElement.addEventListener('mousemove', (e) => {
  if (mousedown) {
    e.preventDefault();
    camera.move(mouseX - e.x, mouseY - e.y);
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

graphElement.addEventListener('touchmove', (e) => {
  console.log(e);  
});

fetch('/big_graph.json')
.then((response) => response.json())
.then((json:string) => {
  graph.create(json);
});

(window as any).changeRender = (value:string) => {
  switch (value) {
    case 'svg':
      graph.renderer = new SvgRender(camera);
      break;
    case 'webgl':
      graph.renderer = new WebGlRenderer(camera);
      break;
  }
}

(window as any).changeZoomMode = (value:string) => {
  switch (value) {
    case 'center':
      break;
    case 'mouse':
      break;
  }
}