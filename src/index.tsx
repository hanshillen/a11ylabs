import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ui from "./components/a11ylabs-ui";
import A11yLabsReader from "./modules/a11ylabs-reader";
import './SCSS/custom_bootstrap.scss';
import './SCSS/a11ylabs.scss';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';


declare global {
    interface Window {
        reader: A11yLabsReader;
    }
}

interface IProps { }

// FontAwesome
library.add(
    faChevronCircleDown
);
dom.watch();

class A11yLabs extends React.Component<IProps> {
    private mounted: boolean = false;
    private reader: A11yLabsReader = new A11yLabsReader(document.body);
    private runVoiceTest = (event: MouseEvent) => {
        let currentVoice = this.reader.speechProfileManager.defaultProfile.voice;
        this.reader.speak(`Hello, my name is ${currentVoice.name}, and this is my voice`);
    };
    
    

    constructor(props: IProps) {
        super(props);
        this.toggleDarkMode = this.toggleDarkMode.bind(this);
        window.reader = this.reader;
    }

    componentDidMount() {
        this.mounted = true;
    }

    toggleDarkMode(dark: Boolean) {
        if (!this.mounted) {
            return
        }
        let classList = document.documentElement.classList;
        if (dark) {
            classList.add("a11ylabs-dark-mode");
            classList.remove("a11ylabs-light-mode");
        } else {
            classList.add("a11ylabs-light-mode");
            classList.remove("a11ylabs-dark-mode");
        }
    }

    render() {
        return (
            <div className="container">
                <div className="border p-2 rounded-lg mt-1" role="banner">
                    <div className="a11ylabs-navbar row align-items-center">
                        <div className="col-sm-auto">
                            <h1 className="h2">A11YLabs</h1>
                        </div>
                        <div className="col-sm-auto">
                            <ul className="a11ylabs-navbar">
                                <li>
                                    <a href="#demo-viewer">Skip to main content</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-sm-auto">
                            <button className="toggle" data-toggle="collapse" data-target="#settings-pane" aria-expanded="true"
                                aria-controls="settings-pane" id="settings-toggle-btn" type="button">
                                Settings
                                <span className="toggle-icon fas fa-chevron-circle-down"></span>
                            </button>
                        </div>
                        <div className="col-sm-auto">
                            <ui.Checkbox id="advanced-options3" label="bla bla" checked="false" />
                        </div>
                        <div className="col-sm-auto">
                            <ui.Switch label="View in dark mode" hideLabel={false} changeHandler={this.toggleDarkMode} checked={window.matchMedia('(prefers-color-scheme: dark)').matches} />
                        </div>
                    </div>
                    <div id="settings-pane" className="collapse show">
                        <form>
                            <fieldset>
                                <legend>Default speech profile</legend>
                                <div className="row a11ylabs-h-fields a11ylabs-v-labels">
                                    <div className="col-sm-auto">
                                        <label htmlFor="lang-picker">Synth language</label>
                                        <select name="lang-picker" id="lang-picker">
                                            <option value="-1">No languages available</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-auto">
                                        <label htmlFor="voice-picker">Synth voice</label>
                                        <select name="voice-picker" id="voice-picker">
                                            <option value="-1">No voices available</option>
                                        </select>

                                    </div>
                                    <div id="rate-setting" className="col-sm-auto">
                                        <ui.Spinner label="Rate" min={0.1} max={3.5} step={0.1} value={1} />
                                    </div>
                                    <div id="pitch-setting" className="col-sm-auto">
                                        <ui.Spinner label="Pitch" min={0} max={2} step={0.1} value={1} />
                                    </div>
                                    <div id="volume-setting" className="col-sm-auto">
                                        <ui.Spinner label="Volume" min={-1} max={1} step={0.1} value={0} />
                                    </div>
                                    <div className="col-sm-auto no-label"> 
                                        <button className="" id="test-voice" type="button" onClick={this.runVoiceTest}>Test voice</button>
                                    </div>
                                </div>
                            </fieldset>
                            <div className="a11ylabs-v-fields">
                                <div className="col-md-auto inline-label less-padding">
                                    <ui.Checkbox id="advanced-options" label="Show advanced options" checked="true" />
                                </div>
                                <div className="col-md-auto inline-label less-padding">
                                    <ui.Checkbox id="advanced-options2" label="bla bla" checked="false" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="error-pane">
                    </div>
                </div>
                <div id="demo-viewer">
                    <button>Test 1</button>
                    <br />
                    <br />
                    <br />
                    <button role="link">Test 2</button>
                    <br />
                    <br />
                    <br />
                    <button role="checkbox" aria-label="Sample label">Test 3</button>
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<A11yLabs />, document.getElementById('root'));