import Knob from "./Knob.js"
import NoteValues from "./NoteValues.js"
import Selector from "./Selector.js"
import Switch from "./Switch.js"

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

        //this.knob = new Knob( "volume" , 0 , 1 , 0.001 , 0.5 ,"knob")
        // this.selector = new Selector("shape", ["sine","square","triangle","sawtooth"], "sine", "selector")
        // this.switch = new Switch('dist', 0, 'switch')

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

        this.rangeElements = {}

        
        this.createBothOscs()
        this.createAdsrUI()
        this.createKeyboard()
        //this.createListeners()
    }

    createBothOscs(){

        const group = newElem({type:"div", id:"osc-group"})
        const osc1 = this.createOscUI(1)
        const osc2 = this.createOscUI(2)

        group.append(osc1,osc2)

        document.body.append(group)
    }

    createOscUI(number){
        const group = newElem({type:"div",classes:["osc-group"]})
        const container = newElem({type:"div",classes:["control-container", number === 1 ? "osc1" : "osc2"]})
        const label = newElem({type:"div",classes:["container-label"]})
        const knobContainer = newElem({type:"div",classes:["knob-container"]})
        number === 1 ? label.innerText = "Osc1" : label.innerText = "Osc2"
        
        //osc1 switch
        const knobSpot3 = newElem({type:"div",classes:["knob-spot"]})
        const newSwitch = new Switch(number === 1 ? 'osc1switch' : 'osc2switch', 1, () => {
            number === 1 ? this.synth.toggleOsc1() : this.synth.toggleOsc2() 
        })
        const switchElem = newSwitch.elem

        // osc1 gain
        const knobSpot = newElem({type:"div",classes:["knob-spot"]})
        const newKnob1 = new Knob( number === 1 ? "osc1gain" : "osc2gain", 0 , 1 , 0.001 , 0.5)
        const knob1Elem = newKnob1.elem
        this.rangeElements[newKnob1.name] = newKnob1.rangeInput
        newKnob1.rangeInput.addEventListener('change', (e) => {
            number === 1 ? this.synth.changeOsc1Volume(parseFloat(e.target.value)) : this.synth.changeOsc2Volume(parseFloat(e.target.value))
        })
        //osc1 pan
        const knobSpot2 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob2 = new Knob( number === 1 ? "osc1pan" : "osc2pan" , 0 , 1 , 0.001 , 0.5)
        const knob2Elem = newKnob2.elem
        this.rangeElements[newKnob2.name] = newKnob2.rangeInput
        newKnob2.rangeInput.addEventListener('change', (e) => {
            number === 1 ? this.synth.changeOsc1Pan(parseFloat(e.target.value)) : this.synth.changeOsc2Pan(parseFloat(e.target.value))
        })
        // osc1 shape selector
        const knobSpot4 = newElem({type:"div",classes:["knob-spot"]})
        const selector = new Selector( number === 1 ? "osc1shape" : "osc2shape", ["sine","square","triangle","sawtooth"], "sine", ()=>{
            number === 1 ? this.synth.changeShapeOsc1() : this.synth.changeShapeOsc2()
        })
        const selectElem = selector.elem

        knobSpot.append(knob1Elem)
        knobSpot2.append(knob2Elem)
        knobSpot3.append(switchElem)
        knobSpot4.append(selectElem)
        knobContainer.append(knobSpot3,knobSpot,knobSpot2,knobSpot4)
        container.append(label,knobContainer)
        group.append(container)
        
        return group
    }

    createAdsrUI(){
        const group = newElem({type:"div", classes:["control-container","adsr"]})
        const label = newElem({type:"div",classes:["container-label"]})
        label.innerText = "A.D.S.R."
        const container = newElem({type:"div",classes:["knob-container"]})
        // adsr attack
        const knobSpot = newElem({type:"div",classes:["knob-spot"]})
        const newKnob1 = new Knob("adsr-attack", 0.001 , 1 , 0.001 , 0.1)
        const knob1Elem = newKnob1.elem
        this.rangeElements[newKnob1.name] = newKnob1.rangeInput
        newKnob1.rangeInput.addEventListener('change', (e) => {
            this.synth.modules.adsr.attack = parseFloat(e.target.value)
        })

        // adsr decay
        const knobSpot2 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob2 = new Knob("adsr-decay", 0 , 1 , 0.001 , 0.5)
        const knob2Elem = newKnob2.elem
        this.rangeElements[newKnob2.name] = newKnob2.rangeInput
        newKnob2.rangeInput.addEventListener('change', (e) => {
            this.synth.modules.adsr.decay = parseFloat(e.target.value)
        })

        // adsr sustain
        const knobSpot3 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob3 = new Knob("adsr-decay", 0 , 1 , 0.001 , 1)
        const knob3Elem = newKnob3.elem
        this.rangeElements[newKnob3.name] = newKnob3.rangeInput
        newKnob3.rangeInput.addEventListener('change', (e) => {
            this.synth.modules.adsr.sustain = parseFloat(e.target.value)
        })

        // adsr release
        const knobSpot4 = newElem({type:"div",classes:["knob-spot"]})
        const newKnob4 = new Knob("adsr-decay", 0 , 1 , 0.001 , 0.1)
        const knob4Elem = newKnob4.elem
        this.rangeElements[newKnob4.name] = newKnob4.rangeInput
        newKnob4.rangeInput.addEventListener('change', (e) => {
            this.synth.modules.adsr.release = parseFloat(e.target.value)
        })

        group.append(label)

        knobSpot.append(knob1Elem)
        knobSpot2.append(knob2Elem)
        knobSpot3.append(knob3Elem)
        knobSpot4.append(knob4Elem)

        container.append(knobSpot,knobSpot2,knobSpot3,knobSpot4)
        group.append(container)
        document.body.append(group)
    }

    createKeyboard(){

        const keyboardElem = newElem({type:'div', id:"keyboard"})

        for(const key in this.keys){
            keyboardElem.append(this.keys[key])
        }

        const container = document.getElementById('keyboard-container')
        container.insertBefore(keyboardElem, container.firstChild)
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