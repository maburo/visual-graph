import React, { useState } from 'react';

// https://github.com/vkbansal/react-contextmenu/blob/master/src/ContextMenu.js

export interface MenuItem {
  key: string,
  name: string,
  callback: (x: number, y: number) => void;
}

export interface Props {
  domElement: HTMLElement;
  menuItems: MenuItem[];
}

interface State {
  x: number;
  y: number;
  visible: boolean;
}

let state: State;
let setState: (state: State) => void;

// TODO: screen aware - smart position

export default function contextMenu(props: Props) {
  [ state, setState ] = useState({x: 0, y: 0, visible: false} as State)
  
  props.domElement.addEventListener('contextmenu', show);
  
  const style = {
    left: `${state.x}px`, 
    top: `${state.y}px` 
  }

  return state.visible ? 
    (
      <ul className="ctx_menu" style={style}>
        { props.menuItems.map(renderItem) }
      </ul>
    ) : (null);
}

function renderItem(item: MenuItem) {
  return (
    <li key={item.key} className="ctx_menu_item" onClick={() => item.callback(state.x, state.y)}>
      {item.name}
    </li>
  );
}

function show(e: MouseEvent) {
  e.preventDefault();

  setState({x: e.x, y: e.y, visible: true});
  
  document.addEventListener('click', hide);
  document.addEventListener('scroll', hide);
  document.addEventListener('touchstart', hide);
  document.addEventListener('resize', hide);
  // document.addEventListener('contextmenu', hide);
}

function hide(e: MouseEvent) {
  e.preventDefault();
  
  setState({x: 0, y: 0, visible: false});

  document.removeEventListener('click', hide);
  document.removeEventListener('scroll', hide);
  document.removeEventListener('touchstart', hide);
  document.removeEventListener('resize', hide);
  // document.removeEventListener('contextmenu', hide);
}