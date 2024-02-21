import Keyboard from "./Keyboard.js";
import NoteValues from "./NoteValues.js";
import Ui from "./Ui.js";
import Internals from "./Internals.js";

export default class Synth{
    constructor(){
        this.keyboard = new Keyboard(this)
        this.ui = new Ui(this)
        this.internals = new Internals(this)

        const ctx = new (AudioContext || webkitAudioContext())()
        if(!ctx) throw 'algo no anda aca :('
        else this.ctx = ctx

        this.settings = {
            masterGain: 0.5,
            firstOsc: {
                enabled: true,
                oldGain:0,
                gain: 0.5,
                pan: 0,
                octave: 0,
                shape: "sine",
                shapes:["sine","triange","square","sawtooth"]
            },
            secondOsc: {
                enabled: true,
                oldGain: 0,
                gain: 0.5,
                pan: 0,
                octave: 0,
                shape: "sine",
                shapes:["sine","triange","square","sawtooth"]
            },
            distortion:{
                enabled: false,
                distFactor: 50,
                currentValue: 0
            },
            delay:{
                enabled: false,
                delayTime: 0.001,
                feedBack: 0.25
            }
        }

        this.modules = {

            osc1MasterGain: this.ctx.createGain(),
            osc2MasterGain: this.ctx.createGain(),

            osc1pan: this.ctx.createStereoPanner(),
            osc2pan: this.ctx.createStereoPanner(),

            masterComp: this.ctx.createDynamicsCompressor(),
            beforeCompGain: this.ctx.createGain(),
            masterGain: this.ctx.createGain(),
            dist: this.ctx.createWaveShaper(),
            distGain: this.ctx.createGain(),
            delay: this.ctx.createDelay(),
            delayGain: this.ctx.createGain(),

            adsr: {attack: 0.001, decay: 0.001, sustain: 1, release: 0.1, maxTime: 2}
        }

        this.modules.osc1MasterGain.channelCountMode = "explicit"
        this.modules.osc1MasterGain.channelCount = 2
        this.modules.osc1MasterGain.gain.value = this.settings.firstOsc.gain
        this.modules.osc2MasterGain.channelCountMode = "explicit"
        this.modules.osc2MasterGain.channelCount = 2
        this.modules.osc2MasterGain.gain.value = this.settings.secondOsc.gain
        this.modules.masterGain.channelCountMode = "explicit"
        this.modules.masterGain.channelCount = 2

        this.modules.osc1pan.pan.value = this.settings.firstOsc.pan
        this.modules.osc2pan.pan.value = this.settings.secondOsc.pan

        this.updateDistValue(this.settings.distortion.currentValue)
        
        this.modules.delay.delayTime.value = 0
        this.modules.delayGain.gain.value = 0.25
        
        this.setupChain()

        this.firstOscActiveNotes = {}
        this.secondOscActiveNotes = {}
        for(let key in NoteValues){
            this.firstOscActiveNotes[key] = null
            this.secondOscActiveNotes[key] = null
        }
    }

    changeOsc1Volume(val){
        this.settings.firstOsc.oldGain = this.settings.firstOsc.gain
        this.settings.firstOsc.gain = val
        if(this.settings.firstOsc.enabled === true){
            this.modules.osc1MasterGain.gain.setValueAtTime(val, this.ctx.currentTime)
        }
    }

    changeOsc2Volume(val){
        this.settings.secondOsc.oldGain = this.settings.secondOsc.gain
        this.settings.secondOsc.gain = val
        if(this.settings.secondOsc.enabled === true){
            this.modules.osc2MasterGain.gain.setValueAtTime(val, this.ctx.currentTime)
        }
    }

    changeMasterVolume(val){
        this.settings.masterGain = val
        this.modules.masterGain.gain.setValueAtTime(val, this.ctx.currentTime)
    }

    changeOsc1Pan(val){
        this.settings.firstOsc.pan = (val*2)-1
        this.modules.osc1pan.pan.value = (val*2)-1
    }
    changeOsc2Pan(val){
        this.settings.secondOsc.pan = (val*2)-1
        this.modules.osc2pan.pan.value = (val*2)-1
    }

    toggleOsc1(){
        if(this.settings.firstOsc.enabled === true){
            this.changeOsc1Volume(0)
            this.settings.firstOsc.enabled = false

        }else{
            this.settings.firstOsc.enabled = true
            this.changeOsc1Volume(this.settings.firstOsc.oldGain)
            this.settings.firstOsc.oldGain = this.settings.firstOsc.gain
        }
    }
    toggleOsc2(){
        console.log("asdasd");
        if(this.settings.secondOsc.enabled === true){
            this.settings.secondOsc.oldGain = this.settings.secondOsc.gain
            this.changeOsc2Volume(0)
            this.settings.secondOsc.enabled = false

        }else{
            this.settings.secondOsc.enabled = true
            this.changeOsc2Volume(this.settings.secondOsc.oldGain)
            this.settings.secondOsc.oldGain = this.settings.secondOsc.gain
        }
    }
    changeShapeOsc1(){
        if(this.settings.firstOsc.shape === "sine") this.settings.firstOsc.shape = "triangle"
        else if(this.settings.firstOsc.shape === "triangle") this.settings.firstOsc.shape = "square"
        else if(this.settings.firstOsc.shape === "square") this.settings.firstOsc.shape = "sawtooth"
        else if(this.settings.firstOsc.shape === "sawtooth") this.settings.firstOsc.shape = "sine"
        else this.settings.firstOsc.shape = "sine"
    }
    changeShapeOsc2(){
        if(this.settings.secondOsc.shape === "sine") this.settings.secondOsc.shape = "triangle"
        else if(this.settings.secondOsc.shape === "triangle") this.settings.secondOsc.shape = "square"
        else if(this.settings.secondOsc.shape === "square") this.settings.secondOsc.shape = "sawtooth"
        else if(this.settings.secondOsc.shape === "sawtooth") this.settings.secondOsc.shape = "sine"
        else this.settings.secondOsc.shape = "sine"
    }

    setupChain(){
        this.modules.osc1MasterGain.connect(this.modules.osc1pan)
        this.modules.osc2MasterGain.connect(this.modules.osc2pan)
        
        this.modules.osc1pan.connect(this.modules.beforeCompGain)
        this.modules.osc2pan.connect(this.modules.beforeCompGain)

        this.modules.beforeCompGain.connect(this.modules.masterComp)
        this.modules.masterComp.connect(this.modules.masterGain)
        this.modules.masterGain.connect(this.ctx.destination)

        this.modules.delay.connect(this.modules.delayGain)
        this.modules.delayGain.connect(this.modules.delay)
        this.modules.delayGain.connect(this.modules.masterComp)
    }

    enableDist(){
        this.modules.beforeCompGain.disconnect(this.modules.masterComp)
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
        const now = this.ctx.currentTime
        const {adsr} = this.modules
        const relDur = adsr.release * adsr.maxTime
        const relEnd = now + relDur
    
        const osc = this.firstOscActiveNotes[note]
        if(osc !== null && osc !== undefined){
            
            
            osc[1].gain.cancelScheduledValues(now)
            osc[1].gain.setValueAtTime(osc[1].gain.value, now)
            osc[1].gain.linearRampToValueAtTime(0, relEnd)

            osc[0].stop(relEnd)
            this.firstOscActiveNotes[note] = null
        }
        const osc2 = this.secondOscActiveNotes[note]
        if(osc2 !== null && osc2 !== undefined){
    
            osc2[1].gain.cancelScheduledValues(now)
            osc2[1].gain.setValueAtTime(osc2[1].gain.value, now)
            osc2[1].gain.linearRampToValueAtTime(0, relEnd)
    
            osc2[0].stop(relEnd)
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