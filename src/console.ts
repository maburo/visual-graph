interface Logger {
  element: HTMLElement;
  text: string;
  name: string;
}

interface LoggersMap {
  [id: string]: Logger;
}

const loggers:LoggersMap = {};

const root = document.createElement('div');
root.style.position = 'fixed';
root.style.top = '0px';
root.style.left = '0px';
root.style.width = '100%';
root.style.backgroundColor = "#FFF"
root.style.opacity = '.55';
root.style.zIndex = '1000';
root.style.padding = '5px 15px';
root.style.pointerEvents = 'none';

document.body.appendChild(root);
console.log('init', root);


function update() {
  Object.keys(loggers).forEach(key => {
    const logger = loggers[key];
    loggers[key].element.innerHTML = `${logger.name}: ${logger.text}`;
  });
}

class Console {
  log(name: string, text: any) {
    const logger = loggers[name];
    if (logger) {
      logger.text = text.toString();
    } else {
      loggers[name] = {
        name, text: text.toString(), element: document.createElement('div')
      };
      root.appendChild(loggers[name].element);
    }

    update();
  }
}

const debugConsole = new Console();

export default debugConsole;