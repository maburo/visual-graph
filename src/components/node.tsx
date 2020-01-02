import * as React from 'react';
// import * as _ from 'lodash';
// import classNames from 'classnames';
import autobind from 'autobind-decorator';

// import { compareWithoutFunctions } from 'ib-flow-components';

// import { Connector } from './connector';

export enum NodeType {
    START_ELEMENT,
    START_WITH_RULES_ELEMENT,
    ACTION_ELEMENT,
    RULES_ELEMENT,
    PAUSE_ELEMENT,
    EXIT_ELEMENT,
    MENU_ELEMENT,
}

export interface NodeConnector {
    x: number;
    y: number;
    order: number;
    connectedTo?: number;
    valid?: boolean;
}

export class Node {
    id: number;
    type: NodeType;
    x: number;
    y: number;
    width: number;
    height: number;
    connectors?: NodeConnector[];
    hovered?: boolean;
}

export interface Props extends Node {
    // children: React.ReactNode;
    selected: boolean;
    // zoomLevel: number;
    // draggingFrom: boolean;
    // draggingFromOrder: number;
    // onStartDrag: (id: number, x: number, y: number) => void;
    // onStartDragConnection: (id: number, order: number, x: number, y: number, mouseX: number, mouseY: number) => void;
    // onHover: (id: number) => void;
    // onClick: (id: number) => void;
    // onLeave: () => void;
}

@autobind
export class NodeComponent extends React.Component<Props> {

    // shouldComponentUpdate(nextProps: Props) {
    //     return compareWithoutFunctions(this.props, nextProps);
    // }

    public render() {
      const classes = 'omni-canvas-node';
        // const classes = classNames('omni-canvas-node', {
        //     'omni-canvas-node--hovered': this.props.hovered,
        //     'omni-canvas-node--selected': this.props.selected,
        // });

        return (
            <div
                className={classes}
                draggable={true}
                // onMouseDown={this.onMouseDown}
                // onMouseOver={this.onMouseOver}
                // onMouseLeave={this.onMouseLeave}
                // onClick={this.onClick}
                style={{
                    position: 'absolute',
                    left: this.props.x,
                    top: this.props.y,
                    cursor: 'pointer',
                }}
            >
                {this.props.children}

                {/* {_.map(this.props.connectors, (connector: NodeConnector, index: number) =>
                    <Connector
                        {...connector}
                        key={index}
                        zoomLevel={this.props.zoomLevel}
                        draggingFrom={this.props.draggingFrom && this.props.draggingFromOrder === connector.order}
                        onStartDrag={this.onStartDragConnection}
                    />
                )} */}
            </div>
        );
    }

    // @autobind
    // private onMouseDown(event: React.MouseEvent<HTMLElement>) {
    //     event.stopPropagation();
    //     event.preventDefault();

    //     if (event.button !== 0) {
    //         return;
    //     }

    //     this.props.onStartDrag(this.props.id, event.clientX, event.clientY);
    // }

    // @autobind
    // private onMouseOver(event: React.MouseEvent<HTMLElement>) {
    //     event.stopPropagation();
    //     event.preventDefault();

    //     this.props.onHover(this.props.id);
    // }

    // @autobind
    // private onMouseLeave(event: React.MouseEvent<HTMLElement>) {
    //     event.stopPropagation();
    //     event.preventDefault();

    //     this.props.onLeave();
    // }

    // @autobind
    // private onClick(event: React.MouseEvent<HTMLElement>) {
    //     event.stopPropagation();
    //     event.preventDefault();

    //     this.props.onClick(this.props.id);
    // }

    // @autobind
    // private onStartDragConnection(order: number, clientX: number, clientY: number, mouseX: number, mouseY: number) {
    //     this.props.onStartDragConnection(this.props.id, order, this.props.x + clientX, this.props.y + clientY, mouseX, mouseY);
    // }
}
