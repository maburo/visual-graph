// import * as React from 'react';
// // import * as _ from 'lodash';
// import classNames from 'classnames';

// import { getMetricsIcon } from '../utils/metric.utils';
// import {
//     FlowElementMetric,
//     FlowElementType,
//     FlowElementPreview,
//     FlowActionStatistics,
//     AppConfig,
// } from 'ib-flow-typings';

// // import { FormatMessage, I18n, _n } from 'ib-i18n';
// import { DiagramReactTooltip } from '../../../utils/diagram-react-tooltip';
// import trafficIcon from '../../../../assets/img/icon-traffic.svg';
// // const __ = str => str;

// const COUNT_PLACEHOLDER = '--';

// interface Props {
//     id: number;
//     zoomLevel: number;
//     metrics: FlowElementMetric;
//     actionStatistics?: FlowActionStatistics[];
//     loadingStatistics?: boolean;
//     loadingActionStatistics?: boolean;
//     config: AppConfig;
//     elementPreview?: FlowElementPreview;
//     type?: FlowElementType | string;
//     showTraffic?: boolean;
//     showAllRecipientCount?: boolean;
// }

// export const Metrics: React.SFC<Props> = (props) => {
//     const { id, actionStatistics, type, elementPreview, config: { enableAbExperiments } } = props;
//     const {
//         START_RESOLVE_ONETIME_AUDIENCE, START_EVALUATE_INBOUND_MESSAGE,
//         START_EVALUATE_PEOPLE_EVENT, START_EVALUATE_BEHAVIOUR_EVENT, START_FLOW_WEBHOOK, START_IVR_INBOUND,
//     } = FlowElementType;
//     const FlowElementTypes: string[] = [
//         START_RESOLVE_ONETIME_AUDIENCE,
//         START_EVALUATE_INBOUND_MESSAGE,
//         START_EVALUATE_PEOPLE_EVENT,
//         START_EVALUATE_BEHAVIOUR_EVENT,
//         START_FLOW_WEBHOOK,
//         START_IVR_INBOUND,
//     ];
//     const count = props.metrics.count || COUNT_PLACEHOLDER;
//     const classes = classNames(
//         'ib-flow-metrics',
//         {
//             'start-element': type && FlowElementTypes.includes(type),
//         });

//     const countMetricsIcon = getMetricsIcon('count', type);
//     const conversionMetricsIcon = getMetricsIcon('conversion', type);
//     const tooltipTitle = () => {
//         if (!elementPreview) {
//             return '';
//         }
//         const { content, title } = elementPreview;
//         return _.remove(FlowElementTypes,
//             elem => elem === START_FLOW_WEBHOOK).includes(type || '') ? content : title;
//     };
//     const elementActionStatistics = actionStatistics && actionStatistics.filter(action => action.stateId === id)[0];
//     const events = _.get(elementActionStatistics, 'events', {});
//     const allRecipientsCount = elementActionStatistics && elementActionStatistics.allRecipientsCount;
//     const traffic = elementActionStatistics && elementActionStatistics.traffic;

//     const showTraffic = props.showTraffic && props.config.enableFlowGoal && traffic !== undefined;
//     const showAllRecipientCount = props.showAllRecipientCount && props.config.enableFlowGoal && allRecipientsCount !== undefined;

//     return (
//         <div
//             className={classes}
//         >
//             <div className="ib-flow-metrics-metric-container">
//                 {!props.config.enableFlowGoal &&
//                     <div className="tf-ib-flow-metrics-metric-box ib-flow-metrics-metric-box ib-flow-metrics-metric-box--people">
//                         <img src={countMetricsIcon}/>
//                         <span>{props.loadingStatistics ? COUNT_PLACEHOLDER : props.metrics.count}</span>
//                     </div>
//                 }
//                 <div className="ib-flow-metrics-metric-box">
//                     <img src={conversionMetricsIcon} />
//                     {!props.loadingStatistics && props.metrics.conversion !== undefined // TODO temporary until migration of old campaigns is fixed
//                         ? (<span>{_n(props.metrics.conversion, { style: 'percent' })}</span>)
//                         : (<span>{COUNT_PLACEHOLDER}</span>)
//                     }
//                 </div>
//                 {showTraffic &&
//                     <div className="ib-flow-metrics-metric-box">
//                         <img src={trafficIcon}/>
//                         <span>{props.loadingStatistics ? COUNT_PLACEHOLDER : traffic}</span>
//                     </div>
//                 }
//             </div>
//             <DiagramReactTooltip id={`node-tooltip-${id}`} place="bottom" className="ib-flow-metrics-tooltip" zoomLevel={props.zoomLevel}>
//                 <div className="ib-flow-metrics-tooltip-title">
//                     {__(tooltipTitle())}
//                 </div>
//                 <div className="ib-flow-metrics-tooltip-data">
//                     <h3 className="ib-flow-metrics-tooltip-data-title">
//                         {props.metrics.tooltipTitle}
//                     </h3>
//                     <p className="ib-flow-metrics-tooltip-data-metric">{count}</p>
//                     { (!_.isEmpty(events) && enableAbExperiments) && Object.keys(events).map((event, index) => (
//                         <div key={index} className="flow-actions-statistics">
//                             <div>{__(_.capitalize(event))}</div>
//                             <div>{events[event]}</div>
//                         </div>
//                     )) }

//                     <p className="ib-flow-metrics-tooltip-data-description">{props.metrics.tooltipDescription}</p>
//                 </div>
//                 {showAllRecipientCount &&
//                     <div className="ib-flow-metrics-tooltip-data">
//                         <h3 className="ib-flow-metrics-tooltip-data-title">
//                             {__('Total engagements')}
//                         </h3>
//                         <p className="ib-flow-metrics-tooltip-data-metric">{allRecipientsCount || COUNT_PLACEHOLDER}</p>
//                         <p className="ib-flow-metrics-tooltip-data-description">
//                             {__('Total engagements for this element (people can be targeted multiple times)')}
//                         </p>
//                     </div>
//                 }
//                 <div className="ib-flow-metrics-tooltip-percentage-info">
//                     <p className="ib-flow-metrics-tooltip-data-description">
//                         {__('Percentage of engaged users can exceed 100% because of multiple entries of the same person.')}
//                     </p>
//                 </div>

//                 {showTraffic &&
//                     <div className="ib-flow-metrics-tooltip-data">
//                         <h3 className="ib-flow-metrics-tooltip-data-title">
//                             {__('Traffic')}
//                         </h3>
//                         <p className="ib-flow-metrics-tooltip-data-metric">{traffic || COUNT_PLACEHOLDER}</p>
//                         <p className="ib-flow-metrics-tooltip-data-description">
//                             {__('Total number of traffic (messages) sent via this communication.')}
//                         </p>
//                     </div>
//                 }
//             </DiagramReactTooltip>
//         </div>
//     );
// };

// export const RuleProgressMetric: React.SFC = () => {
//     return (
//         <div>
//             <div
//                 className="ib-flow-decision-progress"
//                 style={{ width: '25%' }}
//             />
//             <div className="ib-flow-decision-metric">20</div>
//         </div>
//     );
// };
