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
        let shape,decay,sustain, attack, maxTime, octave

        if(oscNumber === 1){
            shape = settings.firstOsc.shape
            octave = settings.firstOsc.octave
        }else{
            shape = settings.secondOsc.shape
            octave = settings.secondOsc.octave
        }

        decay = settings.adsr.decay
        sustain = settings.adsr.sustain
        attack = settings.adsr.attack
        maxTime = settings.adsr.maxTime
        
        const note = Object.entries(NoteValues).find( entry => entry[1] === freq)[0]

        const gain = ctx.createGain()
        const osc = ctx.createOscillator()
        
        const now = ctx.currentTime
        const atkDur = attack * maxTime
        const atkEnd = now + atkDur
        const decayDur = decay * maxTime
        
        
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.25, atkEnd)
        gain.gain.setTargetAtTime(0.25 * sustain, atkEnd, decayDur)

        let octaveMult
        if(octave === -2){
            octaveMult = 0.25
        }else if(octave === -1){
            octaveMult = 0.5
        }else if(octave === -2){
            octaveMult = 0.25
        }else if(octave === 1){
            octaveMult = 2
        }else if(octave === 2){
            octaveMult = 3
        }else if(octave === 3){
            octaveMult = 4
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