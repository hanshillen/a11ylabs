import * as util from './a11ylabs.ui.utils';
import React, { FormEvent, ElementRef, ChangeEvent } from 'react';
import styles from "./scss/spinner.module.scss";

// font awesome

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(
    faMinus,
    faPlus
);
dom.watch();

interface IProps {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (event: FormEvent) => void;
}

interface IState {
    value: string;
}


export default class Spinner extends React.Component<IProps, IState> {
    static count: number = 0;
    public id: string;
    private _input = React.createRef<HTMLInputElement>();

    constructor(props: IProps) {
        super(props);
        this.id = `a11ylabs-spinner-${Spinner.count++}`;
        this.state = {
            value: this.props.value.toString()
        }
    }

    public static defaultProps: IProps = {
        min: 0,
        max: 100,
        step: 1,
        value: 0,
        label: "",
        onChange: (e) => { }
    };

    handleStepChange = (e: FormEvent) => {
        (e.target as HTMLInputElement).name == "inc" ? this.increment() : this.decrement();
    }

    public increment() {
        if (this._input.current) {
            this._input.current.stepUp();
        }
    }

    public decrement() {
        if (this._input.current) {
            this._input.current.stepDown();
        }
    }

    public render() {
        return (
            <>
                <label htmlFor={this.id}>{this.props.label}</label>
                <div className={styles.spinner}>
                    <button type="button" className={styles.decBtn} aria-label={"decrement " + this.props.label} name="dec" onClick={this.handleStepChange}>
                        <span className='fas fa-minus'></span>
                    </button>
                    <input type="number" id={this.id} min={this.props.min} max={this.props.max} step={this.props.step} defaultValue={this.props.value} ref={this._input} onChange={this.props.onChange} />
                    <button type="button" className={styles.incBtn} aria-label={"increment " + this.props.label} name="inc" onClick={this.handleStepChange}>
                        <span className='fas fa-plus'></span>
                    </button>
                </div>
            </>
        );
    }
}