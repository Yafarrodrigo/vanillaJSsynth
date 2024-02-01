import Keyboard from "./Keyboard.js";
import NoteValues from "./NoteValues.js";
import Ui from "./Ui.js";
import Internals from "./Internals.js";

export default class Synth{
    constructor(){
        this.ui = new Ui(this)
        this.keyboard = new Keyboard(this)
        this.internals = new Internals(this)

        const ctx = new (AudioContext || webkitAudioContext())()
        if(!ctx) throw 'algo no anda aca :('
        else this.ctx = ctx

        this.settings = {
            masterGain: 0.5,
            firstOsc: {
                enabled: true,
                gain: 1,
                shape: "sine",
                octave: 0
            },
            secondOsc: {
                enabled: true,
                gain: 1,
                shape: "sine",
                octave: 0
            }
        }

        this.modules = {
            masterComp: this.ctx.createDynamicsCompressor(),
            beforeCompGain: this.ctx.createGain(),
            masterGain: this.ctx.createGain(),
            
            adsr: {attack: 0.001, decay: 0.001, sustain: 1, release: 0.1, maxTime: 2},
            adsr2: {attack: 0.001, decay: 0.001, sustain: 1, release: 0.1, maxTime: 2}
        }

        this.ui.update()

        this.modules.beforeCompGain.connect(this.modules.masterComp)
        this.modules.masterComp.connect(this.modules.masterGain)
        this.modules.masterGain.connect(this.ctx.destination)

        this.firstOscActiveNotes = {}
        this.secondOscActiveNotes = {}
        for(let key in NoteValues){
            this.firstOscActiveNotes[key] = null
            this.secondOscActiveNotes[key] = null
        }
    }

    noteOn(note, freq){
        if(this.settings.firstOsc.enabled === true && this.firstOscActiveNotes[note] === null){
            this.firstOscActiveNotes[note] = this.internals.createOsc(freq,1)
        }
        if(this.settings.secondOsc.enabled === true && this.secondOscActiveNotes[note] === null){
            this.secondOscActiveNotes[note] = this.internals.createOsc(freq,2)
        }
    }
    noteOff(note){
    
        if(this.settings.firstOsc.enabled === true){
            const osc = this.firstOscActiveNotes[note]
            const {adsr} = this.modules
            
            const now = this.ctx.currentTime
            const relDur = adsr.release * adsr.maxTime
            const relEnd = now + relDur
            
            osc[1].gain.cancelScheduledValues(now)
            osc[1].gain.setValueAtTime(osc[1].gain.value, now)
            osc[1].gain.linearRampToValueAtTime(0, relEnd)
    
            osc[0].stop(relEnd)
            this.firstOscActiveNotes[note] = null
        }
        if(this.settings.secondOsc.enabled === true){

            const osc2 = this.secondOscActiveNotes[note]
            const {adsr2} = this.modules

            const now = this.ctx.currentTime
            const relDur2 = adsr2.release * adsr2.maxTime
            const relEnd2 = now + relDur2

            osc2[1].gain.cancelScheduledValues(now)
            osc2[1].gain.setValueAtTime(osc2[1].gain.value, now)
            osc2[1].gain.linearRampToValueAtTime(0, relEnd2)

            osc2[0].stop(relEnd2)
            this.secondOscActiveNotes[note] = null
        }
    }
}