import * as React from 'react';
import styles from './scss/checkbox.module.scss';
import * as utils from './a11ylabs.ui.utils';

interface IProps {
    id: string,
    label: string,
    checked?: "true" | "false";
}

interface IState {
    checked: boolean
}

export default class CheckBox extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = { checked: props.checked === "true" };
    }

    public render() {
        return (
            <div className={styles.checkbox}>
                <input type="checkbox" id={this.props.id} defaultChecked={this.state.checked} />
                <label htmlFor={this.props.id}>{this.props.label}</label>
            </div>
        );
    }
}