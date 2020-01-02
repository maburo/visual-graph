import * as React from 'react';
import {FlowElementType, FlowElementPreview} from './../types'
// import * as _ from 'lodash';
import autobind from 'autobind-decorator';
// import classNames from 'classnames';

// import { FormatMessage, I18n } from 'ib-i18n';
// import { FlowElementMetric, FlowElementPreview, FlowElementType, FlowRule, Validation, ValidationResult } from 'ib-flow-typings';
// import { ActionMenu, compareWithoutFunctions } from 'ib-flow-components';

// import startIcon from '../../../../assets/img/canvas/icon-start-white.svg';
// import plusIcon from '../../../../assets/img/canvas/elements/plus-schnipple.svg';
// import removeIcon from '../../../../assets/img/canvas/elements/remove-schnipple.svg';

// import { RULES_NODE_RULE_DIFF, RULES_NODE_RULE_PADDING } from '../utils/diagram-dimensions.utils';
// import { Metrics } from './metrics';

// const __: FormatMessage = _.partial(I18n.__, 'Diagram');

interface Props {
    id: number;
    type: FlowElementType | string;
    // validationResult?: ValidationResult;
    elementPreview?: FlowElementPreview;
    // rules?: FlowRule[];
    // metrics?: FlowElementMetric;
    // loadingStatistics?: boolean;
    // readonly?: boolean;
    // zoomLevel?: number;
    // onAddRule: (id: number) => void;
    // onRemoveRule: (id: number, index: number) => void;
    // onDelete?: (id: number) => void;
    // onDuplicate?: (id: number) => void;
}

export class StartInboundNode extends React.Component<Props> {

    // shouldComponentUpdate(nextProps: Props) {
    //     return compareWithoutFunctions(this.props, nextProps);
    // }

    render() {
      const classes = 'flow-start-element-header';
        // const classes = classNames('flow-start-element-header', {
        //     warning: _.get(this.props.validationResult, 'type') === Validation.WARNING,
        //     danger: _.get(this.props.validationResult, 'type') === Validation.ERROR,
        // });

        const actionPreview = this.props.elementPreview;
        // const actionTitle = actionPreview ? actionPreview.title : __('Flow Entry Point');
        const actionTitle = 'Flow Entry Point';
        const actionText = actionPreview ? actionPreview.content : '';

        return (
            <div className="flow-start-element" data-flow-element-type={this.props.type} data-flow-element-id={this.props.id}>
                <div
                    className={classes}
                    data-tip="tooltip"
                    data-for={`node-tooltip-${this.props.id}`}
                >
                    {/* <div className="icon">
                        <img src={startIcon} alt="" />
                    </div> */}

                    <div className="title">{actionTitle}</div>

                    {/* {!this.props.readonly && (
                        <div className="text text-ellipsis" style={{width: '200px'}} title={actionText}>{actionText}</div>
                    )} */}

                    {/* {!this.props.readonly && (
                        <ActionMenu className="flow-element-dropdown-menu">
                            <ActionMenu.Item label={__('Delete')} onSelect={this.onDelete} />
                            <ActionMenu.Item label={__('Duplicate')} onSelect={this.onDuplicate} />
                        </ActionMenu>
                    )} */}

                    {/* {this.props.metrics && this.props.readonly && this.props.zoomLevel && (
                        <Metrics
                            id={this.props.id}
                            metrics={this.props.metrics}
                            zoomLevel={this.props.zoomLevel}
                            type={this.props.type}
                            elementPreview={this.props.elementPreview}
                            loadingStatistics={this.props.loadingStatistics}
                        />
                    )} */}
                </div>

                {/* <div className="ib-flow-decision-path">
                    {this.renderBasePath(_.size(this.props.rules))}
                </div> */}

                {/* {this.renderRules()} */}

                {/* {!_.isEmpty(this.props.rules) && (
                    <div className="ib-flow-decision-group-shnipple-wrapper">
                        <button className="ib-flow-decision-group-shnipple" onClick={this.addButtonClickHandler}>
                            <img src={plusIcon} alt="" />
                        </button>
                    </div>
                )} */}
            </div>
        );
    }

    // @autobind
    // private onDelete() {
    //     if (this.props.onDelete) {
    //         this.props.onDelete(this.props.id);
    //     }
    // }

    // @autobind
    // private onDuplicate() {
    //     if (this.props.onDuplicate) {
    //         this.props.onDuplicate(this.props.id);
    //     }
    // }

    // @autobind
    // private renderRules() {
    //     return (
    //         <div className="ib-flow-decision-group-decisions">
    //             {_.map(this.props.rules, (rule: FlowRule, index: number) => {
    //                 const ruleContent = this.props.elementPreview ? this.props.elementPreview.rulesContent![index] : __('Define content in panel');

    //                 return (
    //                     <div
    //                         key={index}
    //                         className="ib-flow-decision"
    //                         style={{ top: RULES_NODE_RULE_PADDING + RULES_NODE_RULE_DIFF * index }}
    //                     >
    //                         <svg viewBox="0 0 200 50" width="200" height="50">
    //                             <g className="omni-flow-path">
    //                                 <path className="omni-flow-path-path" d="M30,35 h23" />
    //                             </g>
    //                         </svg>

    //                         <div className="ib-flow-decision-text-cont">
    //                             <div className="ib-flow-decision-text text-ellipsis" title={ruleContent}>
    //                                 {ruleContent}
    //                             </div>
    //                         </div>

    //                         {!rule.nextElementId && !rule.valid && false && (// TODO enable when rules are validated
    //                             <div className="ib-flow-decision-group-shnipple-wrapper-remove">
    //                                 <button
    //                                     data-index={index}
    //                                     onClick={this.removeButtonClickHandler}
    //                                     className="ib-flow-decision-shnipple ib-flow-decision-shnipple--remove"
    //                                 >
    //                                     <img src={removeIcon}  alt="" />
    //                                 </button>
    //                             </div>
    //                         )}
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //     );
    // }

    // @autobind
    // private addButtonClickHandler() {
    //     this.props.onAddRule(this.props.id);
    // }

    // @autobind
    // private removeButtonClickHandler(event: React.MouseEvent<HTMLButtonElement>) {
    //     const dataIndex = event.currentTarget.dataset.index;
    //     if (dataIndex) {
    //         const index = parseInt(dataIndex, 10);
    //         this.props.onRemoveRule(this.props.id, index);
    //     }
    // }

    // @autobind
    // private renderBasePath(size: number) {
    //     const height = RULES_NODE_RULE_DIFF * size;
    //     return (
    //         <svg viewBox={`0 0 50 ${height}`} width="50" height={height}>
    //             <g className="omni-flow-path">
    //                 <path className="omni-flow-path-path" d={`M30,0 v${height - 15}`} />
    //             </g>
    //         </svg>
    //     );
    // }
}
