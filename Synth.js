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
            },
            distortion:{
                enabled: false,
                distFactor: 50,
                currentValue: 0
            },
            delay:{
                enabled: false,
                delayTime: 0,
                feedBack: 0.25
            }
        }

        this.modules = {
            masterComp: this.ctx.createDynamicsCompressor(),
            beforeCompGain: this.ctx.createGain(),
            masterGain: this.ctx.createGain(),
            dist: this.ctx.createWaveShaper(),
            distGain: this.ctx.createGain(),
            delay: this.ctx.createDelay(),
            delayGain: this.ctx.createGain(),

            adsr: {attack: 0.001, decay: 0.001, sustain: 1, release: 0.1, maxTime: 2},
            adsr2: {attack: 0.001, decay: 0.001, sustain: 1, release: 0.1, maxTime: 2}
        }

        this.ui.update()

        this.updateDistValue(this.settings.distortion.currentValue)
        this.modules.delay.delayTime.value = 0
        this.modules.delayGain.gain.value = 0.25
        this.modules.delay.connect(this.modules.delayGain)
        this.modules.delayGain.connect(this.modules.delay)
        this.modules.delayGain.connect(this.modules.masterComp)
        
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

    enableDist(){
        this.modules.beforeCompGain.connect(this.modules.dist)
        this.modules.dist.connect(this.modules.distGain)
        if(this.settings.delay.enabled){
            this.modules.distGain.connect(this.modules.delay)
        }
        this.modules.distGain.connect(this.modules.masterComp)
        this.settings.distortion.enabled = true
    }

    disableDist(){
        this.modules.dist.disconnect()
        this.modules.distGain.disconnect()
        this.modules.beforeCompGain.connect(this.modules.masterComp)
        this.settings.distortion.enabled = false
    }

    enableDelay(){
        this.settings.delay.enabled = true
        this.modules.beforeCompGain.connect(this.modules.delay)
        this.modules.delay.connect(this.modules.delayGain)
        this.modules.delayGain.connect(this.modules.delay)
        this.modules.delayGain.connect(this.modules.masterComp)
    }
    disableDelay(){
        this.settings.delay.enabled = false
        this.modules.delay.disconnect()
        this.modules.delayGain.disconnect()
        this.modules.beforeCompGain.connect(this.modules.masterComp)
    }

    updateDelayValue(value){
        if(this.settings.delay.delayTime === 0 && value > 0){
            this.enableDelay()
        }
        this.settings.delay.delayTime = value
        this.modules.delay.delayTime.setValueAtTime(value, this.ctx.currentTime)
    }

    updateFeedbackValue(value){
        this.settings.delay.feedBack = value
        this.modules.delayGain.gain.setValueAtTime(value, this.ctx.currentTime)
    }

    updateDistValue(value){
        this.settings.distortion.currentValue = value
        this.modules.dist.curve = makeDistortionCurve(value * this.settings.distortion.distFactor )
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

// ??? -> curva de distortion
function makeDistortionCurve( amount ) {
    var k = typeof amount === 'number' ? amount : 0,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };