import * as React from 'react';
import styles from './scss/switch.module.scss';
import * as utils from './a11ylabs.ui.utils';
import CheckBox from './a11ylabs.ui.checkbox';

interface IProps {
    label: string;
    checked: boolean;
    hideLabel: boolean;
    changeHandler: Function;
}

interface IState {
    checked: boolean
}

export default class Switch extends React.Component<IProps, IState> {
    static count: number = 0;
    public id: string;
    constructor(props: IProps) {
        super(props);
        this.id = `a11ylabs-switch-${Switch.count++}`;
        this.state = { checked: props.checked };
        this.handleChange = this.handleChange.bind(this);
        this.props.changeHandler(this.state.checked);
        console.log(typeof this.props.hideLabel);
    }

    public static defaultProps: IProps = {
        label: "",
        checked: false,
        hideLabel: false,
        changeHandler: () => { }
    };

    handleChange(e: React.ChangeEvent) {
        let target = e.target as HTMLInputElement;
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
                <input type="checkbox" id={this.id} defaultChecked={this.state.checked} role="switch" onChange={this.handleChange} />
                <label htmlFor={this.id}>
                    <span className={this.props.hideLabel ? "sr-only" : ""}>{this.props.label}</span>
                </label>
            </div>
        );
    }
}