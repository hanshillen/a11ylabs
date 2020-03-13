import * as ui from "./components/a11ylabs-ui";
import A11yLabsReader from "./modules/a11ylabs-reader";
import './SCSS/custom_bootstrap.scss';
import './SCSS/a11ylabs.scss';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';

// FontAwesome
library.add(
    faChevronCircleDown
);
dom.watch();

declare global {
    interface Window {
        reader: A11yLabsReader;
    }
}

function handleLangChange(reader: A11yLabsReader, lang: string, voicePicker: Element) {
    reader.speechProfileManager.currentLang = lang;
    voicePicker.innerHTML = getVoiceOptionsHTML(reader, lang);
    voicePicker.dispatchEvent(new Event("change"));
}

function handleVoiceChange(reader: A11yLabsReader, voiceIndex: number) {
    reader.speechProfileManager.setProfileProperty("voice", voiceIndex);
}

function getLangOptionsHTML(reader: A11yLabsReader) {
    let voicesByLang = reader.speechProfileManager.voicesByLang;
    let langs = Object.keys(voicesByLang).sort().sort(
        // move English voices to the top
        (el1, el2) => el1.startsWith("en-") ? -1 : el2.startsWith("en-") ? 1 : 0
    );
    let optionsStr = "";
    optionsStr += `<option value="all">All</option>`;
    for (const lang of langs) {
        optionsStr += `<option value="${lang}">${lang}</option>`;
    }
    return optionsStr;
}

function getVoiceOptionsHTML(reader: A11yLabsReader, lang: string) {
    let optionsStr = "";
    if (lang == "all") {
        let voices = reader.speechProfileManager.voices;
        for (let i = 0; i < voices.length; i++) {
            optionsStr += `<option value="${i}">${voices[i].name}</option>`;
        }
    } else {
        let voices = reader.speechProfileManager.voicesByLang[lang];
        if (voices.length) {
            for (const voiceObj of voices) { // looping over array now, so 'of' rather than 'in'
                optionsStr += `<option value="${voiceObj.i}">${voiceObj.voice.name}</option>`;
            }
        }
    }
    return optionsStr;
}

window.addEventListener("DOMContentLoaded", (e: Event) => {
    let reader = new A11yLabsReader(ui.$("#demo-viewer"));
    window.reader = reader;

    let settingsBtn = ui.$("#settings-toggle-btn").addEventListener("click", (e:Event)=>{
        let button = e.currentTarget as HTMLButtonElement;
        let pane = ui.$("#settings-pane");
        let isExpanded = button.getAttribute("aria-expanded") == "true";
        button.setAttribute("aria-expanded", (!isExpanded + ""));
        button.classList.toggle("collapsed", isExpanded);
        pane.classList.toggle("hidden", isExpanded);
    })
    //ui.$("#settings-btnholder").insertAdjacentHTML("afterbegin", settingsBtnHTML);


    let noSpeechMsg = `
        <div role="alert" class="alert alert-danger">
            <h3>Warning: speechSynthesis not supported</h3>
            <p>Unfortunatly, your browser does not support the speechSynthesis interface of the Web Speech API. 
            A11y Labs needs this interface to simulate screen reader ouput as intended for the experiments on this 
            page. While you can still use the demos with a regular screen reader, you will likely not get the 
            intended user experience. For more information about Web Speech API and the browsers that support it, 
            see <a href="http://https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API">
            MDN Web Docs - Web speech API</a>.
            </p>
        </div>`;

    if (!reader.speechSupported) {
        let errorPane = ui.$("#error-pane");
        errorPane.insertAdjacentHTML("beforeend", noSpeechMsg);
        ui.$$("input, button, select", errorPane).forEach((el) => {
            el.setAttribute("disabled", "disabled");
        });
        return;
    }

    // build setting controls

    let langPicker = ui.$("#lang-picker") as HTMLSelectElement;
    langPicker.innerHTML = getLangOptionsHTML(reader);
    langPicker.value = reader.speechProfileManager.currentLang;
    langPicker.addEventListener("change", (e: Event) => {
        let el: HTMLSelectElement = e.target as HTMLSelectElement;
        handleLangChange(reader, el.value, ui.$("#voice-picker"));
    });

    let voicePicker = ui.$("#voice-picker");
    voicePicker.innerHTML = getVoiceOptionsHTML(reader, langPicker.value);
    voicePicker.addEventListener("change", (e: Event) => {
        let el: HTMLSelectElement = e.target as HTMLSelectElement;
        handleVoiceChange(reader, parseInt(el.value, 10));
    });

    type pickerCfgs = { [key: string]: [number, number, number, number, string, object?]; };

    var pickerCfgs: pickerCfgs = {
        rate: [0.1, 3.5, 0.1, 1, "Rate"],
        pitch: [0, 2, 0.1, 1, "Pitch"],
        volume: [-1, 1, 0.1, 0, "Volume"],
    };

    for (let pickerType in pickerCfgs) {
        let [min, max, step, value, labelText, options] = pickerCfgs[pickerType];
        let picker = new ui.Spinner(min, max, step, value, labelText, options);
        let el = ui.$(`#${pickerType}-setting`);
        el.append(picker.container);
    }

    ui.$("#test-voice").addEventListener("click", (e: Event) => {
        let currentVoice = reader.speechProfileManager.defaultProfile.voice;
        reader.speak(`Hello, my name is ${currentVoice.name}, and this is my voice`);
    });
});