import { storiesOf } from '@storybook/html';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

import SvgRender from '../src/render/svg/svgRenderer';
import HtmlRenderer from '../src/render/html/htmlRenderer';
import WebGlRenderer from '../src/render/gl/glRender';
import Camera from '../src/render/camera';
import Graph from '../src/graph';
import GraphController from '../src/graphController';

import '../src/styles/style.scss'
import { Matrix3D } from '../src/render/render';

function renderEngine(camera:Camera) {
  const renderEngine = select('Render Engine', {
    SVG: 'svg',
    HTML: 'html',
    WebGL: 'gl'
  }, 'svg');

  switch (renderEngine) {
    case 'svg':
      return new SvgRender(camera);
    case 'html':
      return new HtmlRenderer(camera);
    case 'gl':
      return new WebGlRenderer(camera);
  }
}

const camera = new Camera();
const ctrl = new GraphController(camera);

storiesOf('Graph', module)
.addDecorator(withKnobs)
.add('graph', () => {
  const root = document.createElement('div');
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.overflow = 'hidden';
  
  
  const graph = new Graph(root);
  ctrl.graph = graph;
  graph.renderer = renderEngine(camera);
  ctrl.register(graph.renderer.domElement);
  graph.render();
   

  boolean('Debug info', false);
  const freeCamera = boolean('Free camera', false);
  graph.renderer.freeCamera = freeCamera;
  graph.renderer.zoomToCursor = boolean('Zoom to cursor', false);

  fetch('/big_graph.json')
  .then((response) => response.json())
  .then((json:string) => {
    graph.create(json);
  });


  return root;
});