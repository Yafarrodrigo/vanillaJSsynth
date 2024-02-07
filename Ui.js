import Knob from "./Knob.js"
import Selector from "./Selector.js"
import Switch from "./Switch.js"

export default class Ui{
    constructor(synth){
        this.synth = synth
        this.keys = {
            "C4": document.getElementById('key-c'),
            "C#4": document.getElementById('key-c-sharp'),
            "D4": document.getElementById('key-d'),
            "D#4": document.getElementById('key-d-sharp'),
            "E4": document.getElementById('key-e'),
            "F4": document.getElementById('key-f'),
            "F#4": document.getElementById('key-f-sharp'),
            "G4": document.getElementById('key-g'),
            "G#4": document.getElementById('key-g-sharp'),
            "A4": document.getElementById('key-a'),
            "A#4": document.getElementById('key-a-sharp'),
            "B4": document.getElementById('key-b'),
            "C5": document.getElementById('key-cc'),
            "C#5": document.getElementById('key-cc-sharp'),
            "D5": document.getElementById('key-dd'),
            "D#5": document.getElementById('key-dd-sharp'),
            "E5": document.getElementById('key-ee'),
            "F5": document.getElementById('key-ff'),
            "F#5": document.getElementById('key-ff-sharp'),
            "G5": document.getElementById('key-gg'),
            "G#5": document.getElementById('key-gg-sharp'),
            "A5": document.getElementById('key-aa'),
            "A#5": document.getElementById('key-aa-sharp'),
            "B5": document.getElementById('key-bb'),
            "C6": document.getElementById('key-ccc')
        }

        this.masterGainControl = document.getElementById('control-gain')
        this.osc1gainControl = document.getElementById('control-gain-osc')
        this.osc2gainControl = document.getElementById('control-gain-osc2')
        this.osc1octaveControl = document.getElementById('octave')
        this.osc2octaveControl = document.getElementById('octave2')
        this.osc1attackControl = document.getElementById('control-attack')
        this.osc2attackControl = document.getElementById('control-attack2')
        this.osc1decayControl = document.getElementById('control-decay')
        this.osc2decayControl = document.getElementById('control-decay2')
        this.osc1sustainControl = document.getElementById('control-sustain')
        this.osc2sustainControl = document.getElementById('control-sustain2')
        this.osc1releaseControl = document.getElementById('control-release')
        this.osc2releaseControl = document.getElementById('control-release2')
        this.osc1shapeControlGroup = document.querySelectorAll('input[name="control-shape"]')
        this.osc2shapeControlGroup = document.querySelectorAll('input[name="control-shape2"]')
        
        this.distortionButton = document.getElementById('distDiv')
        this.distortionControl = document.getElementById('control-distortion')
        
        this.delayControl = document.getElementById('control-delay')
        this.feedbackControl = document.getElementById('control-feedback')

        // this.knob = new Knob( "volume" , 0 , 1 , 0.001 , 0 , "knob" )
        // this.selector = new Selector("shape", ["sine","square","triangle","sawtooth"], "sine", "selector")
        // this.switch = new Switch('dist', 0, 'switch')

        this.createListeners()
    }

    createListeners(){

        this.distortionButton.addEventListener('click', (e) => {
            if(this.synth.settings.distortion.enabled === true){
                e.target.classList.remove("activated")
                this.synth.disableDist()
            }else{
                e.target.classList.add("activated")
                this.synth.enableDist()
            }
        })

        this.masterGainControl.addEventListener('input', (e) => {
            this.synth.settings.masterGain = parseFloat(e.target.value)
            this.synth.modules.masterGain.gain.setValueAtTime(parseFloat(e.target.value), this.synth.ctx.currentTime)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc1gainControl.addEventListener('input', (e) => {
            this.synth.settings.firstOsc.gain = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc1octaveControl.addEventListener('input', (e) => {
            this.synth.settings.firstOsc.octave = parseInt(e.target.value)
            e.target.nextSibling.innerText = e.target.value < 0 ? "-" + e.target.value : "+" + e.target.value
        })
        this.osc1attackControl.addEventListener('input', (e) => {
            this.synth.modules.adsr.attack = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value < 0 ? "-" + e.target.value : "+" + e.target.value
        })
        this.osc1decayControl.addEventListener('input', (e) => {
            this.synth.modules.adsr.decay = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc1sustainControl.addEventListener('input', (e) => {
            this.synth.modules.adsr.sustain = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc1releaseControl.addEventListener('input', (e) => {
            this.synth.modules.adsr.release = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc1shapeControlGroup.forEach( elem => {
            elem.addEventListener('click', (e) => {
                this.synth.settings.firstOsc.shape = e.target.value
            })
        })
        this.osc2gainControl.addEventListener('input', (e) => {
            this.synth.settings.secondOsc.gain = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc2octaveControl.addEventListener('input', (e) => {
            this.synth.settings.secondOsc.octave = parseInt(e.target.value)
            e.target.nextSibling.innerText = e.target.value < 0 ? "-" + e.target.value : "+" + e.target.value
        })
        this.osc2attackControl.addEventListener('input', (e) => {
            this.synth.modules.adsr2.attack = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc2decayControl.addEventListener('input', (e) => {
            this.synth.modules.adsr2.decay = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc2sustainControl.addEventListener('input', (e) => {
            this.synth.modules.adsr2.sustain = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc2releaseControl.addEventListener('input', (e) => {
            this.synth.modules.adsr2.release = parseFloat(e.target.value)
            e.target.nextSibling.innerText = e.target.value
        })
        this.osc2shapeControlGroup.forEach( elem => {
            elem.addEventListener('click', (e) => {
                this.synth.settings.secondOsc.shape = e.target.value
            })
        })
        this.distortionControl.addEventListener('input', (e) => {
            this.synth.updateDistValue(parseFloat(e.target.value))
            e.target.nextSibling.innerText = e.target.value
        })
        this.delayControl.addEventListener('input', (e) => {
            this.synth.updateDelayValue(parseFloat(e.target.value))
            e.target.nextSibling.innerText = e.target.value
        })
        this.delayControl.addEventListener('change', (e) => {
            if(parseFloat(e.target.value) === 0){
                this.synth.disableDelay()
            }
        })
        
        this.feedbackControl.addEventListener('input', (e) => {
            this.synth.updateFeedbackValue(parseFloat(e.target.value))
            e.target.nextSibling.innerText = e.target.value
        })
    }

    update(){
        const { settings,modules } = this.synth
        const {adsr,adsr2} = modules

        this.masterGainControl.value = settings.masterGain
        this.masterGainControl.nextSibling.innerText = settings.masterGain
        
        this.osc1gainControl.value =  settings.firstOsc.gain
        this.osc1gainControl.nextSibling.innerText = settings.firstOsc.gain

        this.osc2gainControl.value = settings.secondOsc.gain
        this.osc2gainControl.nextSibling.innerText = settings.secondOsc.gain

        this.osc1octaveControl.value = settings.firstOsc.octave
        this.osc1octaveControl.nextSibling.innerText = settings.firstOsc.octave

        this.osc2octaveControl.value = settings.secondOsc.octave
        this.osc2octaveControl.nextSibling.innerText = settings.secondOsc.octave

        this.osc1attackControl.value = adsr.attack
        this.osc1attackControl.nextSibling.innerText = adsr.attack

        this.osc2attackControl.value = adsr2.attack
        this.osc2attackControl.nextSibling.innerText = adsr2.attack

        this.osc1decayControl.value = adsr.decay
        this.osc1decayControl.nextSibling.innerText = adsr.decay

        this.osc2decayControl.value = adsr2.decay
        this.osc2decayControl.nextSibling.innerText =adsr2.decay

        this.osc1sustainControl.value = adsr.sustain
        this.osc1sustainControl.nextSibling.innerText =adsr.sustain

        this.osc2sustainControl.value = adsr2.sustain
        this.osc2sustainControl.nextSibling.innerText =adsr2.sustain

        this.osc1releaseControl.value = adsr.release
        this.osc1releaseControl.nextSibling.innerText = adsr.release

        this.osc2releaseControl.value = adsr2.release
        this.osc2releaseControl.nextSibling.innerText = adsr2.release

        this.distortionControl.value = settings.distortion.currentValue
        this.distortionControl.nextSibling.innerText = settings.distortion.currentValue
        this.delayControl.value = settings.delay.delayTime
        this.delayControl.nextSibling.innerText = settings.delay.delayTime
        this.feedbackControl.value = settings.delay.feedBack
        this.feedbackControl.nextSibling.innerText = settings.delay.feedBack
    }

    press(note){
        this.keys[note].classList.add('pressed')
    }

    release(note){
        this.keys[note].classList.remove('pressed')
    }
}