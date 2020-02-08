const svg = require('./nodes/one-time-audience.svg');

const svgNS = "http://www.w3.org/2000/svg";

function createSvgNode(type:string, options:any) {
  const node = document.createElementNS(svgNS, type);
  Object.keys(options).forEach((key:string) => {
    node.setAttributeNS(null, key, options[key]);
  });
  return node;
}

export default class NodeFactory {
  parser = new DOMParser();

  create(data:any) {
    // if (data.type === 'SEND_ACTION') {
    //   return this.sms(data)
    // } else if (data.type == 'EXIT') {
    //   return this.exit(data);
    // } else {
    //   console.log(data.type);
      
      return this.createNode(data);
    // }
  }

  exit(data:any) {
    const el = this.parser.parseFromString(svg, 'text/html')
    .getElementById('exit')
    el.setAttributeNS(null, 'transform', `translate(${data.diagramX}, ${data.diagramY})`)
    el.setAttributeNS(null, 'class', 'node exit')
    return el;
  }

  createOneTimeAudience() {
    const el = this.parser.parseFromString(svg, 'text/html')
    .getElementById('one-time-audience')
    el.setAttributeNS(null, 'transform', 'scale(2.5)')
    el.setAttributeNS(null, 'class', 'node one-time-audience')
    return el;
  }

  sms(data:any) {
    const el = this.parser.parseFromString(svg, 'text/html')
    .getElementById('sms')
    el.setAttributeNS(null, 'transform', `translate(${data.diagramX}, ${data.diagramY})`)
    el.setAttributeNS(null, 'class', 'sms')
    return el;
  }

  createNode(data:any) {
    const group = createSvgNode('g', {
      id: data.id,
      visible: true,
      transform: `translate(${data.diagramX}, ${data.diagramY})`
    });

    const svgNode = createSvgNode('rect', {
      width: 30,
      height: 30,
      fill: 'black'
    });
    
    const text = createSvgNode('text', {});
    text.style.fontSize = '24px';
    text.appendChild(document.createTextNode(data.id))

    group.appendChild(svgNode);
    group.appendChild(text);

    return group;
  }
}

// <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
//   <g fill="#ffffff">
//     <g>
//       <circle cx="1.5" cy="1.5" r="1.5"></circle>
//       <circle cx="1.5" cy="7.5" r="1.5"></circle>
//       <circle cx="1.5" cy="13.5" r="1.5"></circle>
//     </g>
//   </g>
// </g>