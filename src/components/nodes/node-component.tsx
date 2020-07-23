import * as React from 'react';
import RenderElement from '../../render/render-element';
import { FlowElement, FlowElementType, RequestType } from 'ib-flow-typings';

export interface Props {
  renderElement: RenderElement<FlowElement>;
}

const SEND_ACTION_CLASS: any = {};
SEND_ACTION_CLASS[RequestType.APPLICATION_TYPE_FACEBOOK] = 'facebook';
SEND_ACTION_CLASS[RequestType.APPLICATION_TYPE_VIBER] = 'viber';
SEND_ACTION_CLASS[RequestType.APPLICATION_TYPE_WHATSAPP] = 'whatsapp';
SEND_ACTION_CLASS[RequestType.APPLICATION_TYPE_TELEGRAM] = 'telegram';
SEND_ACTION_CLASS[RequestType.APPLICATION_TYPE_SMS_MT] = 'sms';
SEND_ACTION_CLASS[RequestType.EMAIL] = 'email';
SEND_ACTION_CLASS[RequestType.APPLICATION_TYPE_RCS] = 'rcs';
SEND_ACTION_CLASS[RequestType.SERVICE_VOIP_OUTBOUND] = 'voip';
SEND_ACTION_CLASS[RequestType.APPLICATION_TYPE_NEW_PUSH_NOTIF] = 'new-push-notif';
SEND_ACTION_CLASS[RequestType.APPLICATION_TYPE_PUSH_SIG] = 'push-sig';

export default class App extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    const element = this.props.renderElement.data;

    switch (element.type) {
      case FlowElementType.SEND_ACTION:
        return this.renderSendAction(element);

      case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
        return this.renderDefaultAction(element);;

      case FlowElementType.START_EVALUATE_PEOPLE_EVENT:
        return this.renderDefaultAction(element);;

      case FlowElementType.CALL_URL:
        return this.renderDefaultAction(element);;

      case FlowElementType.ADD_TAG:
        return this.renderDefaultAction(element);;

      default:
        return this.renderDefaultAction(element);
    }
  }

  renderDefaultAction(element: FlowElement) {
    return (
      <div style={{
        width: '30px', 
        height: '30px', 
        backgroundColor: '#f0f0f0'}}>
      </div>
    )
  }

  renderSendAction(element: FlowElement) {
    return (
      <div className={SEND_ACTION_CLASS[element.action.serviceMessagingData.requestType]} style={{
        width: '46px', 
        height: '46px'}}>
      </div>
    )
  }
}