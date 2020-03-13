// types & interfaces

interface SpeechProfileProps {
    [key: string]: string | SpeechSynthesisVoice | number;
    voice: SpeechSynthesisVoice;
    lang: string;
    rate: number;
    volume: number;
    pitch: number;
}

type speechProfilePropNames = keyof SpeechProfileProps;

type speechProfileType = "default" | "name" | "role" | "states" | "description" | "relations";

type announcementType = "misc" | "element" | "state-change" | "context" | "ancestry";

interface voiceByLang {
    i: number;
    voice: SpeechSynthesisVoice;
}

interface voicesByLang {
    [lang: string]: voiceByLang[];
}

// class definitions

class SpeechProfile {
    private _lang!: string;
    private _rate!: number;
    private _volume!: number;
    private _pitch!: number;
    private _voice!: SpeechSynthesisVoice;
    constructor ({ voice, lang = "en-US", rate = 3, volume = 1, pitch = 1 }: SpeechProfileProps) {
        this.lang = lang;
        this.rate = rate;
        this.volume = volume;
        this.pitch = pitch;
        this.voice = voice;
    }

    /**
     * Keep numeric value within bounds
     **/
    static constrain(val: number, min: number, max: number) {
        return Math.min(Math.max(val, min), max);
    }

    public get lang() { return this._lang; }
    public get rate() { return this._rate; }
    public get volume() { return this._volume; }
    public get pitch() { return this._pitch; }
    public get voice() { return this._voice; }

    public set lang(val: string) {
        this._lang = val;
    }

    public set rate(val: number) {
        this._rate = SpeechProfile.constrain(val, 0.1, 3.5);
    }

    public set volume(val: number) {
        this._volume = SpeechProfile.constrain(val, 0, 1);
    }

    public set pitch(val: number) {
        this._pitch = SpeechProfile.constrain(val, 0, 2);
    }

    public set voice(val: SpeechSynthesisVoice) {
        this._voice = val;
    }
}

class SpeechProfileManager {
    getProfile(type: speechProfileType): SpeechProfile {
        let profile: SpeechProfile;
        switch (type) {
            case 'name':
                profile = this.nameProfile;
                break;
            case 'role':
                profile = this.roleProfile;
                break;
            case 'description':
                profile = this.descriptionProfile;
                break;
            case 'states':
                profile = this.statesProfile;
                break;
            case 'relations':
                profile = this.relationsProfile;
                break;
            default:
                profile = this.defaultProfile;
                break;
        }
        return profile;
    }

    private _voices: SpeechSynthesisVoice[] = speechSynthesis.getVoices();
    private _defaultProfile!: SpeechProfile;
    private _nameProfile!: SpeechProfile;
    private _roleProfile!: SpeechProfile;
    private _statesProfile!: SpeechProfile;
    private _descriptionProfile!: SpeechProfile;
    private _relationsProfile!: SpeechProfile;
    private _voicesByLang: voicesByLang = {};
    private _languages: string[] = [];
    public currentLang: string = "en-US";
    public reader: Reader;

    constructor (reader: Reader) {
        this.reader = reader;
        // TODO: How to use onVoicesChanged here?
        for (let i: number = 0; i < this._voices.length; i++) {
            let voice: SpeechSynthesisVoice = this._voices[i];
            let lang: string = voice.lang;
            const obj: { [key: string]: string; } = { lang: lang };
            if (!this._voicesByLang[obj.lang]) {
                this._voicesByLang[lang] = new Array();
                this._languages.push(lang);
            }
            this._voicesByLang[lang].push({ i, voice });
        }

        //let defaultVoice: SpeechSynthesisVoice = this._voicesByLang[this.currentLang][0].voice;
        let defaultVoice: SpeechSynthesisVoice = this._voices[0];
        this.defaultProfile = new SpeechProfile({ voice: defaultVoice, rate: 1, pitch: 1, volume: 1, lang: this.currentLang });
        this.nameProfile = this.defaultProfile;
        this.roleProfile = this.defaultProfile;
        this.descriptionProfile = this.defaultProfile;
        this.statesProfile = this.defaultProfile;
        this.relationsProfile = this.defaultProfile;
    }
    
    public setProfileProperty(propertyName: speechProfilePropNames, propertyValue: number | string, profileType: speechProfileType = "default") {
        let profile: SpeechProfile = this.getProfile(profileType);
        switch (propertyName) { // figure out how to let TypeScript allow this without switch
            case "voice":
                if (typeof propertyValue == "number" && propertyValue >= 0 && propertyValue <= this.voices.length) {
                    profile.voice = this.voices[propertyValue];
                }
                break;
            case "volume":
            case "pitch":
            case "rate":
                profile[propertyName] = propertyValue as number;
                break;
            case "lang":
                profile[propertyName] = propertyValue as string;
                break;
            default:
                break;
        }
    }

    public get voicesByLang() {
        return this._voicesByLang;
    }

    public get voices() {
        return this._voices;
    }

    public set defaultProfile(profile: SpeechProfile) {
        this._defaultProfile = profile;
    }
    public set nameProfile(profile: SpeechProfile) {
        this._nameProfile = profile;
    }
    public set roleProfile(profile: SpeechProfile) {
        this._roleProfile = profile;
    }
    public set descriptionProfile(profile: SpeechProfile) {
        this._descriptionProfile = profile;
    }
    public set relationsProfile(profile: SpeechProfile) {
        this._relationsProfile = profile;
    }
    public set statesProfile(profile: SpeechProfile) {
        this._statesProfile = profile;
    }
    public get defaultProfile(): SpeechProfile { return this._defaultProfile; }
    public get nameProfile(): SpeechProfile { return this._nameProfile; }
    public get roleProfile(): SpeechProfile { return this._roleProfile; }
    public get descriptionProfile(): SpeechProfile { return this._descriptionProfile; }
    public get statesProfile(): SpeechProfile { return this._statesProfile; }
    public get relationsProfile(): SpeechProfile { return this._relationsProfile; }
}

class Announcement {
    private _utterances: SpeechSynthesisUtterance[] = [];
    private _currentUtterance: SpeechSynthesisUtterance | undefined;
    private _type: announcementType;
    public onEnd: Function = function (announcement: Announcement) {
        console.log("No more utterances left!");
    };
    public reader: Reader;
    private _asString: string = "";

    constructor (reader: Reader, text: string | string[], type: announcementType) {
        this.reader = reader;
        this._type = type;
        text = typeof text === "string" ? [text] : text;
        // TODO determine what speechProfileType to use based on announcementType
        text.forEach((e: string, i: number) => {
            let utteranceType: speechProfileType = "default";
            this._addUtterance(e, utteranceType);
        });
        this._asString = this._utterances.map(ut => ut.text).join(" ");
        
    }

    _playNextUtterance(): void {
        this._currentUtterance = this._utterances.shift();
        if (this._currentUtterance) {
            this.reader.queueManager.speechManager.speak(this._currentUtterance);
        } else {
            this.onEnd(this);
        }
    }

    private _handleUtteranceEnd(e: SpeechSynthesisEvent) {
        this._playNextUtterance();
    }

    private _addUtterance(text: string, profile: SpeechProfile): void;
    private _addUtterance(text: string, profile: speechProfileType | null): void;
    private _addUtterance(text: any, profile: any): any {
        let utteranceProfile: SpeechProfile;
        if (profile instanceof SpeechProfile) {
            utteranceProfile = profile;
        } else {
            utteranceProfile = this.reader.speechProfileManager.getProfile(!profile ? "default" : profile);
        }
        let utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
        utterance.lang = utteranceProfile.lang;
        utterance.pitch = utteranceProfile.pitch;
        utterance.rate = utteranceProfile.rate;
        utterance.volume = utteranceProfile.volume;
        utterance.voice = utteranceProfile.voice;

        console.log(utterance);

        utterance.onend = this._handleUtteranceEnd.bind(this);
        this._utterances.push(utterance);
    }

    public play(): void {
        this._playNextUtterance();
    }

    public toString(): string {
        return this._asString;
    }
}

class SpeechManager {
    public speak(utterance: SpeechSynthesisUtterance) {
        console.log("!!HEY!!! %s", utterance.rate);

        speechSynthesis.speak(utterance);
    }
    public stop() {
        speechSynthesis.cancel();
    }
}

class QueueManager {
    private _announcementQueue: Announcement[] = [];
    private _currentAnnouncement: Announcement | undefined;
    public speechManager = new SpeechManager();
    public reader: Reader;

    constructor (reader: Reader) {
        this.reader = reader;
    }

    private _push(announcement: Announcement): void {
        this._announcementQueue.push(announcement);
    }

    private _unshift(announcement: Announcement): void {
        this._announcementQueue.unshift(announcement);
    }

    private _playNext(): void {
        this._currentAnnouncement = this._announcementQueue.shift();
        if (this._currentAnnouncement === undefined) {
            console.log("There, I said it! (finished announncement queue)");
            return;
        }
        this._currentAnnouncement.onEnd = this._handleEnd.bind(this);
        this._currentAnnouncement.play();

    }

    private _handleEnd(announcement: Announcement) {
        console.log("finished announcement: " + announcement.toString());
        this._playNext();
    }

    public clear(): void {
        this.speechManager.stop();
        this._announcementQueue = [];
    }
    public add(msg: string | string[], type: announcementType, clear: Boolean = false) {
        if (clear) {
            this.clear();
        }
        this._push(new Announcement(this.reader, msg, type));
        this._playNext();
    }
}

/**
 * Provides basic A11yLabs screen reader functionality
 */
class Reader {
    public speechProfileManager: SpeechProfileManager;
    public queueManager: QueueManager;
    private _scope: Node;

    constructor (scopeElement: Node) {
        this._scope = scopeElement;
        this.speechProfileManager = new SpeechProfileManager(this);
        this.queueManager = new QueueManager(this);
    }

    public get speechSupported() {
        return !!window.speechSynthesis;
    }

    public speak(msg: string | string[] = ["this", "is", "a", "test"], type: announcementType = "misc"): void {
        this.queueManager.add(msg, type, true);
    }
}

export default Reader;