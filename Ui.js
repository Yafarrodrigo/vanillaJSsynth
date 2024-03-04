import Knob from "./Knob.js"
import NoteValues from "./NoteValues.js"
import Selector from "./Selector.js"
import Switch from "./Switch.js"
import TwoButtons from "./TwoButtons.js"

export default class Ui{
    constructor(synth){
        this.synth = synth

        this.keys = {}
        const mappings = synth.keyboard.keyCodes
        
        let counter = 0
        for(const note in NoteValues){
            const newNoteDiv = document.createElement('div')
            newNoteDiv.id = 'key-' + note
            newNoteDiv.innerText = mappings[counter]
            counter++
            note.includes("#") ? newNoteDiv.classList.add('key','sharp') : newNoteDiv.classList.add('key')
            this.keys[note] = newNoteDiv
        }

        this.distortionButton = document.getElementById('distDiv')
        this.distortionControl = document.getElementById('control-distortion')
        
        this.delayControl = document.getElementById('control-delay')
        this.feedbackControl = document.getElementById('control-feedback')

        this.createMasterControls()
        this.createBothOscs()
        this.createAdsrUI()
        this.createDelayUI()
        this.createDistUI()
        this.createKeyboard()
    }

    createBothOscs(){

        const osc1 = this.createOscUI(1)
        const osc2 = this.createOscUI(2)

        document.getElementById('osc1Slot').append(osc1)
        document.getElementById('osc2Slot').append(osc2)
    }

    createMasterControls(){
        const container = newElem({type:"div",classes:["control-container"]})
        const label = newElem({type:"div",classes:["container-label"]})
        const knobContainer = newElem({type:"div",classes:["knob-container"]})
        label.innerText = "Master"

        // gain
        const knobSpot = newElem({type:"div",classes:["knob-spot"]})
        const newKnob1 = new Knob("masterGain", 0 , 1 , 0.001 , 0.5)
        const knob1Elem = newKnob1.elem
        newKnob1.rangeInput.addEventListener('change', (e) => {
            this.synth.changeMasterGain(parseFloat(e.target.value))
        })

        container.append(label)
        knobSpot.append(knob1Elem)
        knobContainer.append(knobSpot)

        container.append(knobContainer)

        document.getElementById('masterSlot').append(container)
    }

    createOscUI(number){
        const group = newElem({type:"div",classes:["osc-group"]})
        const container = newElem({type:"div",classes:["control-container", number === 1 ? "osc1" : "osc2"]})
        const label = newElem({type:"div",classes:["container-label"]})
        const knobContainer = newElem({type:"div",classes:["knob-container"]})
        number === 1 ? label.innerText = "Osc1" : label.innerText = "Osc2"
        
        // switch
        const knobSpot3 = newElem({type:"div",classes:["knob-spot"]})
        const newSwitch = new Switch(number === 1 ? 'osc1switch' : 'osc2switch', 1, () => {
            number === 1 ? this.synth.toggleOsc1() : this.synth.toggleOsc2() 
        })
        const switchElem = newSwitch.elem

        // gain
        const knobSpot = newElem({type:"div",classes:["knob-spot"]})
        const newKnob1 = new Knob( number === 1 ? "osc1gain" : "osc2gain", 0 , 1 , 0.001 , 0.5)
        const knob1Elem = newKnob1.elem
        newKnob1.rangeInput.addEventListener('change', (e) => {
            number === 1 ? this.synth.changeOsc1Volume(parseFloat(e.target.value)) : this.synth.changeOsc2Volume(parseFloat(e.target.value))
        })
        // pan
        const knobSpot2 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob2 = new Knob( number === 1 ? "osc1pan" : "osc2pan" , 0 , 1 , 0.001 , 0.5)
        const knob2Elem = newKnob2.elem
        newKnob2.rangeInput.addEventListener('change', (e) => {
            number === 1 ? this.synth.changeOsc1Pan(parseFloat(e.target.value)) : this.synth.changeOsc2Pan(parseFloat(e.target.value))
        })
        // shape selector
        const knobSpot4 = newElem({type:"div",classes:["knob-spot"]})
        const selector = new Selector( number === 1 ? "osc1shape" : "osc2shape", ["sine","square","triangle","sawtooth"], "sine", ()=>{
            number === 1 ? this.synth.changeShapeOsc1() : this.synth.changeShapeOsc2()
        })
        const selectElem = selector.elem

        // octave
        const knobSpot5 = newElem({type:"div",classes:["knob-spot"]})
        const twoButtons = new TwoButtons( number === 1 ? 'osc1octave' : 'osc2octave',
            () => number === 1 ? this.synth.osc1ChangeOctave(1) : this.synth.osc2ChangeOctave(1),
            () => number === 1 ? this.synth.osc1ChangeOctave(-1) : this.synth.osc2ChangeOctave(-1))

        const twoButtonsElem = twoButtons.container

        knobSpot.append(knob1Elem)
        knobSpot2.append(knob2Elem)
        knobSpot3.append(switchElem)
        knobSpot4.append(selectElem)
        knobSpot5.append(twoButtonsElem)
        knobContainer.append(knobSpot3,knobSpot,knobSpot2,knobSpot4,knobSpot5)
        container.append(label,knobContainer)
        group.append(container)
        
        return group
    }

    createAdsrUI(){
        const group = newElem({type:"div", classes:["control-container"]})
        const label = newElem({type:"div",classes:["container-label"]})
        label.innerText = "A.D.S.R."
        const container = newElem({type:"div",classes:["knob-container"]})
        // adsr attack
        const knobSpot = newElem({type:"div",classes:["knob-spot"]})
        const newKnob1 = new Knob("adsr-attack", 0.001 , 1 , 0.001 , 0.1)
        const knob1Elem = newKnob1.elem
        newKnob1.rangeInput.addEventListener('change', (e) => {
            this.synth.settings.adsr.attack = parseFloat(e.target.value)
        })

        // adsr decay
        const knobSpot2 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob2 = new Knob("adsr-decay", 0 , 1 , 0.001 , 0.5)
        const knob2Elem = newKnob2.elem
        newKnob2.rangeInput.addEventListener('change', (e) => {
            this.synth.settings.adsr.decay = parseFloat(e.target.value)
        })

        // adsr sustain
        const knobSpot3 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob3 = new Knob("adsr-decay", 0 , 1 , 0.001 , 1)
        const knob3Elem = newKnob3.elem
        newKnob3.rangeInput.addEventListener('change', (e) => {
            this.synth.settings.adsr.sustain = parseFloat(e.target.value)
        })

        // adsr release
        const knobSpot4 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob4 = new Knob("adsr-decay", 0 , 1 , 0.001 , 0.1)
        const knob4Elem = newKnob4.elem
        newKnob4.rangeInput.addEventListener('change', (e) => {
            this.synth.settings.adsr.release = parseFloat(e.target.value)
        })

        group.append(label)

        knobSpot.append(knob1Elem)
        knobSpot2.append(knob2Elem)
        knobSpot3.append(knob3Elem)
        knobSpot4.append(knob4Elem)

        container.append(knobSpot,knobSpot2,knobSpot3,knobSpot4)
        group.append(container)
        document.getElementById('adsrSlot').append(group)
    }

    createDelayUI(){
        const group = newElem({type:"div", classes:["control-container"]})
        const label = newElem({type:"div",classes:["container-label"]})
        label.innerText = "Delay"
        const container = newElem({type:"div",classes:["knob-container"]})

        //delay switch
        const knobSpot = newElem({type:"div",classes:["knob-spot"]})
        const newSwitch = new Switch("delay-time", 1, () => {
            if(this.synth.settings.delay.enabled === true){
                this.synth.disableDelay()
            }else{
                this.synth.enableDelay()
            }
        })
        const switchElem = newSwitch.elem

        // delay time knob
        const knobSpot2 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob2 = new Knob("delay-time", 0.001 , 1 , 0.001 , 0)
        const knob2Elem = newKnob2.elem
        newKnob2.rangeInput.addEventListener('change', (e) => {
            this.synth.updateDelayValue(parseFloat(e.target.value))
        })

        // delay feedback knob
        const knobSpot3 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob3 = new Knob("delay-feedback", 0 , 1 , 0.001 , 0.25)
        const knob3Elem = newKnob3.elem
        newKnob3.rangeInput.addEventListener('change', (e) => {
            this.synth.updateFeedbackValue(parseFloat(e.target.value))
        })

        group.append(label)

        knobSpot.append(switchElem)
        knobSpot2.append(knob2Elem)
        knobSpot3.append(knob3Elem)

        container.append(knobSpot,knobSpot2,knobSpot3)
        group.append(container)
        document.getElementById('delaySlot').append(group)
    }

    createDistUI(){
        const group = newElem({type:"div", classes:["control-container"]})
        const label = newElem({type:"div",classes:["container-label"]})
        label.innerText = "Distortion"
        const container = newElem({type:"div",classes:["knob-container"]})

        //distortion switch
        const knobSpot = newElem({type:"div",classes:["knob-spot"]})
        const newSwitch = new Switch("distortion-switch", 1, () => {
            if(this.synth.settings.distortion.enabled === true){
                this.synth.disableDist()
            }else{
                this.synth.enableDist()
            }
        })
        const switchElem = newSwitch.elem

        // distortion gain knob
        const knobSpot2 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob2 = new Knob("distortion-gain", 0 , 1 , 0.001 , 0)
        const knob2Elem = newKnob2.elem
        newKnob2.rangeInput.addEventListener('change', (e) => {
            this.synth.updateDistValue(parseFloat(e.target.value))
        })

        group.append(label)

        knobSpot.append(switchElem)
        knobSpot2.append(knob2Elem)

        container.append(knobSpot,knobSpot2)
        group.append(container)
        document.getElementById('distSlot').append(group)
    }

    createKeyboard(){

        const keyboardElem = newElem({type:'div', id:"keyboard"})

        for(const key in this.keys){
            keyboardElem.append(this.keys[key])
        }

        const container = document.getElementById('keyboard-container')
        container.append(keyboardElem)
    }

    press(note){
        this.keys[note].classList.add('pressed')
    }

    release(note){
        this.keys[note].classList.remove('pressed')
    }
}

function newElem({type="div", id=Math.random()*9999, classes=""}){
    const elem = document.createElement(type)
    elem.id = id
    elem.classList.add(...classes)

    return elem
}