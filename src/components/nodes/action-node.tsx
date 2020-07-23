// import * as React from 'react';
// // import * as _ from 'lodash';
// import classNames from 'classnames';
// import autobind from 'autobind-decorator';

// // import { FormatMessage, I18n } from 'ib-i18n';
// import {
//     FlowAction,
//     FlowElementMetric,
//     FlowElementPreview,
//     FlowElementType,
//     Validation,
//     ValidationResult,
//     FlowActionStatistics,
//     AppConfig,
// } from 'ib-flow-typings';
// // import { ActionMenu, compareWithoutFunctions } from 'ib-flow-components';

// // import { TruncateWithEllipsis } from '../../truncate-with-ellipsis';
// import { ElementGroup, getAllFlowElements, resolveUrlShortenedText } from './utils';
// // import { Metrics } from './metrics';
// // import sanitizeHtml from 'sanitize-html';

// // const __: FormatMessage = _.partial(I18n.__, 'Diagram');

// const MAX_NUMBER_OF_ELEMENTS_AFTER_WHICH_DISABLE_TRUNCATE = 75;

// interface Props {
//     id: number;
//     type: FlowElementType | string;
//     action?: FlowAction;
//     elementPreview?: FlowElementPreview;
//     validationResult?: ValidationResult;
//     readonly?: boolean;
//     failover?: boolean;
//     metrics?: FlowElementMetric;
//     actionStatistics?: FlowActionStatistics[];
//     loadingStatistics?: boolean;
//     loadingActionStatistics?: boolean;
//     config: AppConfig;
//     totalNumberOfElements: number;
//     onDelete?: (id: number) => void;
//     onDuplicate?: (id: number) => void;
//     zoomLevel?: number;
//     showMetricsTraffic?: boolean;
//     showMetricsAllRecipientCount?: boolean;
// }

// export class ActionNode extends React.Component<Props> {

//     // shouldComponentUpdate(nextProps: Props) {
//     //     return compareWithoutFunctions(this.props, nextProps);
//     // }

//     render() {
//         const elementDefinition = _.find(getAllFlowElements(), ['type', this.props.type]);
//         const elementGroup = elementDefinition ? elementDefinition.group : ElementGroup.CHANNEL;

//         const classes = classNames('ib-flow-action-group', `ib-flow-action-group--${elementGroup.toLowerCase()}`, {
//             warning: _.get(this.props.validationResult, 'type') === Validation.WARNING,
//             danger: _.get(this.props.validationResult, 'type') === Validation.ERROR,
//         });

//         const messageTextClasses = classNames('ib-flow-action-group-message-text fs-block', {
//             'ib-flow-action-group-message-text--failover': this.props.readonly,
//         });

//         const elementPreview = this.props.elementPreview;
//         const title = elementPreview ? elementPreview.title : '';

//         const urlShorteningParams = _.get(this.props.action, 'serviceMessagingData.urlShorteningParams', undefined);
//         let actionText = elementPreview ? elementPreview.content : '';

//         if (!!urlShorteningParams) {
//             // actionText = resolveUrlShortenedText(actionText, urlShorteningParams);
//         }

//         return (
//             <div
//                 className={classes}
//                 data-flow-element-type={this.props.type}
//                 data-flow-element-id={this.props.id}
//                 data-tip="tooltip"
//                 data-for={`node-tooltip-${this.props.id}`}
//             >
//                 <div className="ib-flow-action-group-left-border" />
//                 <div className="ib-flow-action-group-icon">
//                     <img src={elementPreview ? elementPreview.icon : ''} alt="" />
//                 </div>

//                 <div className="ib-flow-action-group-text-container">
//                     <div className="ib-flow-action-group-title text-ellipsis" title={title}>
//                         {title}
//                     </div>

//                     <div className={messageTextClasses}>
//                         {/* {this.props.failover
//                             ? <div
//                                 dangerouslySetInnerHTML={{
//                                     __html: sanitizeHtml(actionText, { allowedTags: ['span'], allowedAttributes: { 'span': ['class'] }}),
//                                 }}
//                             />
//                             : <TruncateWithEllipsis
//                                 text={actionText}
//                                 shouldTruncate={this.props.totalNumberOfElements <= MAX_NUMBER_OF_ELEMENTS_AFTER_WHICH_DISABLE_TRUNCATE}
//                             />
//                         } */}
//                     </div>
//                 </div>
//                 {/* {!this.props.readonly && (
//                     <div className="flow-element-dropdown-menu-cont">
//                         <ActionMenu className="flow-element-dropdown-menu" inverseColor={true}>
//                             <ActionMenu.Item label={__('Delete')} onSelect={this.onDelete} />
//                             <ActionMenu.Item label={__('Duplicate')} onSelect={this.onDuplicate} />
//                         </ActionMenu>
//                     </div>
//                 )} */}

//                 {/* {this.props.metrics && this.props.readonly && this.props.zoomLevel && (
//                     <Metrics
//                         id={this.props.id}
//                         metrics={this.props.metrics}
//                         actionStatistics={this.props.actionStatistics}
//                         zoomLevel={this.props.zoomLevel}
//                         elementPreview={this.props.elementPreview}
//                         loadingStatistics={this.props.loadingStatistics}
//                         loadingActionStatistics={this.props.loadingActionStatistics}
//                         config={this.props.config}
//                         showTraffic={this.props.showMetricsTraffic}
//                         showAllRecipientCount={this.props.showMetricsAllRecipientCount}
//                     />
//                 )} */}
//             </div>
//         );
//     }

//     @autobind
//     private onDelete() {
//         if (this.props.onDelete) {
//             this.props.onDelete(this.props.id);
//         }
//     }

//     @autobind
//     private onDuplicate() {
//         if (this.props.onDuplicate) {
//             this.props.onDuplicate(this.props.id);
//         }
//     }
// }
