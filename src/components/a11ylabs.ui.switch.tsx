import * as React from 'react';
import styles from './scss/switch.module.scss';
import * as utils from './a11ylabs.ui.utils';
import CheckBox from './a11ylabs.ui.checkbox';

interface IProps {
    id: string;
    label: string;
    checked?: "true" | "false";
    hideLabel?: "true" | "false";
    changeHandler?: Function;
}

interface IState {
    checked: boolean
}

export default class Switch extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { checked: props.checked === "true" };
        this.handleChange = this.handleChange.bind(this);
        if (this.props.changeHandler) {
            this.props.changeHandler(this.state.checked);
        }
    }

    handleChange(e:React.ChangeEvent) {
        let target: HTMLInputElement = e.target;
        console.log(target.checked)
        this.setState({
            checked: target.checked
        });
        if (this.props.changeHandler) {
            this.props.changeHandler(target.checked);
        }
    }

    public render() {
        return (
            <div className={styles.switch}>
                <input type="checkbox" id={this.props.id} defaultChecked={this.state.checked} role="switch" onChange={this.handleChange} />
                <label htmlFor={this.props.id}>
                    <span className={this.props.hideLabel == "true" ? "sr-only" : ""}>{this.props.label}</span>
                </label>
            </div>
        );
    }
}