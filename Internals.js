import NoteValues from "./NoteValues.js"

export default class Internals{
    constructor(synth){
        this.synth = synth
        this.usingFilter = false
    }

    applyFilter(input, output){
        if(this.usingFilter){
            const filter = this.synth.ctx.createBiquadFilter()
            filter.type = "lowpass"
            filter.frequency.value = 100
            filter.Q.value = 100

            input.connect(filter)
            filter.connect(output)
        }else{
            input.connect(output)
        }
    }

    createOsc(freq, oscNumber){

        const {ctx,modules, settings} = this.synth
        let shape,oscGain,decay,sustain, attack, maxTime, octave

        if(oscNumber === 1){
            shape = settings.firstOsc.shape
            oscGain = settings.firstOsc.gain
            octave = settings.firstOsc.octave
            decay = modules.adsr.decay
            sustain = modules.adsr.sustain
            attack = modules.adsr.attack
            maxTime = modules.adsr.maxTime
        }else{
            shape = settings.secondOsc.shape
            oscGain = settings.secondOsc.gain
            octave = settings.secondOsc.octave
            decay = modules.adsr2.decay
            sustain = modules.adsr2.sustain
            attack = modules.adsr2.attack
            maxTime = modules.adsr2.maxTime
        }
        const note = Object.entries(NoteValues).find( entry => entry[1] === freq)[0]

        const gain = ctx.createGain()
        const osc = ctx.createOscillator()
        
        const now = ctx.currentTime
        const atkDur = attack * maxTime
        const atkEnd = now + atkDur
        const decayDur = decay * maxTime
        
        
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.25 * oscGain, atkEnd)
        gain.gain.setTargetAtTime(0.25 * sustain * oscGain, atkEnd, decayDur)

        let octaveMult
        if(octave === -1){
            octaveMult = 0.5
        }else if(octave === -2){
            octaveMult = 0.25
        }else if(octave === 1){
            octaveMult = 2
        }else if(octave === 2){
            octaveMult = 3
        }else octaveMult = 1
        
        osc.type = shape
        osc.frequency.value = freq * octaveMult
        
       this.applyFilter(osc,gain)

        if(oscNumber === 1){
            gain.connect(modules.osc1MasterGain)
        }else{
            gain.connect(modules.osc2MasterGain)
        }

        osc.start()
        return [osc,gain,note]
    }
}