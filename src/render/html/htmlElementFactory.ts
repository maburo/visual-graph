import { FlowElementType, FlowElement, RequestType, MoCondition, ReceiverType } from 'ib-flow-typings';
import Node from '../../node';

export interface ElementFactory<DataType, R> {
  create(node: Node<DataType>, levelOfDetail: number): R;
}

export default class HtmlElementFactory implements ElementFactory<FlowElement, HTMLElement> {

  create(node: Node<FlowElement>, levelOfDetail: number): HTMLElement {
    const el = document.createElement('div');
    el.className = 'node';

    // el.clientWidth;
    // el.clientHeight;
    
    return el;

    switch (node.data.type) {
      case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
        console.log('create one-time audience');
        return null;

      case FlowElementType.START_EVALUATE_PEOPLE_EVENT:
        console.log('create peaople event');
        return null;

      case FlowElementType.ADD_TAG:
        console.log('create add tag');
        return null;

      case FlowElementType.SEND_ACTION:
        console.log('create send action');
        
        return this.createSendAction();
        // switch (element.action.serviceMessagingData.requestType) {
        //   case RequestType.APPLICATION_TYPE_WHATSAPP:
        //     return null;
        // }
      
      case FlowElementType.EVALUATE_INBOUND_MESSAGE:
        console.log('create evaluate inbound message');
        return null;
        // switch ((element.rules[0].condition as MoCondition).receiver.receiverType) {
        //   case ReceiverType.WHATSAPP:
        //     return null;
        // }

      case FlowElementType.START_EVALUATE_INBOUND_MESSAGE:
        console.log('create start evaluate inbound message');
        return null;
    }
  }

  private createSendAction() {
    const el = document.createElement('div');
    el.className = 'node';

    // el.clientWidth;
    // el.clientHeight;
    
    return el;
  }
}
