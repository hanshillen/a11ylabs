import * as util from './a11ylabs.ui.utils';
import React from 'react';

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
    id: string,
    label: string,


}

interface IState {
    checked: boolean;
}


export default class Spinner {
    static count: number = 0;
    public el: HTMLDivElement;
    public container: Element;
    public decBtn: HTMLButtonElement;
    public incBtn: HTMLButtonElement;
    public input: HTMLInputElement;
    public id: string = "";

    public value: number;
    constructor (min: number, max: number, step: number, value: number = 1, labelText: string, options: Object = {}) {

        this.id = `a11ylabs-spinner-${Spinner.count++}`;
        //number input
        let inputHTML = `
            <input type="number" id="${this.id}" min="${min}", max="${max}", step="${step}", value="${value}" />
        `;
        this.value = value;
        //Buttons
        let decBtnHTML = `
            <button type="button" class="decBtn" aria-label="decrement ${labelText}">
                <span class='fas fa-minus'></span>
            </button>`;
        let incBtnHTML = `
            <button type="button" class="incBtn" aria-label="increment ${labelText}">
                <span class='fas fa-plus'></span>
            </button>`;

        let labelHTML = `<label for="${this.id}">${labelText}</label>`;
        this.el = document.createElement("div");
        this.container = document.createElement("div");
        this.container.classList.add("a11ylabs-spinner-container");
        this.container.insertAdjacentHTML("afterbegin", labelHTML);
        this.el.classList.add("a11ylabs-spinner");
        this.el.innerHTML = decBtnHTML + inputHTML + incBtnHTML;
        this.container.append(this.el);
        this.input = util.$(`#${this.id}`, this.el) as HTMLInputElement;
        this.decBtn = util.$(`.decBtn`, this.el) as HTMLButtonElement;
        this.incBtn = util.$(`.incBtn`, this.el) as HTMLButtonElement;

        this.incBtn.addEventListener("click", (e) => this.handleIncClick(e));
        this.decBtn.addEventListener("click", (e) => this.handleDecClick(e));
        this.input.addEventListener("change", (e) => this.handleInputChange(e));
    }

    handleInputChange(e: Event) {
        this.value = parseInt(this.input.value, 10);
    }

    handleIncClick(e: Event): void {
        this.increment();
    }

    handleDecClick(e: Event): void {
        this.decrement();
    }

    public increment() {
        this.input.stepUp();
    }

    public decrement() {
        this.input.stepDown();
    }

    render() {

    }
}