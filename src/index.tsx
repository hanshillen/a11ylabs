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

// FontAwesome
library.add(
    faChevronCircleDown
);
dom.watch();

let reader = new A11yLabsReader(ui.$("#demo-viewer"));
window.reader = reader;

class A11yLabs extends React.Component {
    render() {
        return (
            <div className="container">he
                <div className="border p-2 rounded-lg mt-1" role="banner">
                    <div className="row align-items-center">
                        <div className="col-sm-auto">
                            <h1 className="h2">A11YLabs</h1>
                        </div>
                        <div className="col-sm-auto">
                            <ul className="navbar-nav">
                                <li className="navbar-item">
                                    <a href="#demo-viewer" className="nav-link">Skip to main content</a>
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
                    </div>
                    <div id="settings-pane" className="collapse show">
                        <form>
                            <fieldset>
                                <legend>Default speech profile</legend>
                                <div className="row block-labels">
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

                                    </div>
                                    <div id="pitch-setting" className="col-sm-auto">

                                    </div>
                                    <div id="volume-setting" className="col-sm-auto">

                                    </div>
                                    <div className="col-sm-auto no-label">
                                        <button className="" id="test-voice" type="button">Test
                                    voice</button>
                                    </div>
                                </div>
                            </fieldset>
                            <div className="row block-labels">
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