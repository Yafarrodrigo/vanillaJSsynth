const ctx = new (AudioContext || webkitAudioContext())()
if(!ctx) throw 'algo no anda aca :('

const settings = {
    gain: 0.5,
    filter: true
}
const adsr = {attack: 0.005, decay: 0.01, sustain: 1, release: 0.3}
const maxTime = 2
let activeOsc = [null,null,null,null,null,null,null,null]
let activeKeys = [false,false,false,false,false,false,false,false]


document.addEventListener('contextmenu', (e) => e.preventDefault())
document.addEventListener('keydown', (e) => {
    if (e.repeat) return 
    else checkDown(e)
})
document.addEventListener('keyup', (e) => {
    checkUp(e)
})

function checkUp(e){
    if(e.key === "1"){
        activeKeys[0] = false
        document.getElementById('key-c').classList.remove('pressed')
        noteOff(0)
    }else if(e.key === "2"){
        activeKeys[1] = false
        document.getElementById('key-d').classList.remove('pressed')
        noteOff(1)
    }else if(e.key === "3"){
        activeKeys[2] = false
        document.getElementById('key-e').classList.remove('pressed')
        noteOff(2)
    }else if(e.key === "4"){
        activeKeys[3] = false
        document.getElementById('key-f').classList.remove('pressed')
        noteOff(3)
    }else if(e.key === "5"){
        activeKeys[4] = false
        document.getElementById('key-g').classList.remove('pressed')
        noteOff(4)
    }else if(e.key === "6"){
        activeKeys[5] = false
        document.getElementById('key-a').classList.remove('pressed')
        noteOff(5)
    }else if(e.key === "7"){
        activeKeys[6] = false
        document.getElementById('key-b').classList.remove('pressed')
        noteOff(6)
    }else if(e.key === "8"){
        activeKeys[7] = false
        document.getElementById('key-cc').classList.remove('pressed')
        noteOff(7)
    }else return
}
function checkDown(e){
    if(e.key === "1" && activeKeys[0] === false){
        activeKeys[0] = true
        document.getElementById('key-c').classList.add('pressed')
        noteOn(0,261.63)
    }else if(e.key === "2" && activeKeys[1] === false){
        activeKeys[1] = true
        document.getElementById('key-d').classList.add('pressed')
        noteOn(1,293.66)
    }else if(e.key === "3" && activeKeys[2] === false){
        activeKeys[2] = true
        document.getElementById('key-e').classList.add('pressed')
        noteOn(2,329.63)
    }else if(e.key === "4" && activeKeys[3] === false){
        activeKeys[3] = true
        document.getElementById('key-f').classList.add('pressed')
        noteOn(3,349.23)
    }else if(e.key === "5" && activeKeys[4] === false){
        activeKeys[4] = true
        document.getElementById('key-g').classList.add('pressed')
        noteOn(4,392.00)
    }else if(e.key === "6" && activeKeys[5] === false){
        activeKeys[5] = true
        document.getElementById('key-a').classList.add('pressed')
        noteOn(5,440.00)
    }else if(e.key === "7" && activeKeys[6] === false){
        activeKeys[6] = true
        document.getElementById('key-b').classList.add('pressed')
        noteOn(6,493.88)
    }else if(e.key === "8" && activeKeys[7] === false){
        activeKeys[7] = true
        document.getElementById('key-cc').classList.add('pressed')
        noteOn(7,523.25)
    }else{
        activeKeys.map( ()=> false)
    }
}

function noteOn(keyNumber, freq){
    activeOsc[keyNumber] = createOsc(freq,"sawtooth")
    masterGain.gain.setValueAtTime(settings.gain, ctx.currentTime)
}
function noteOff(keyNumber){
    
    if(activeOsc[keyNumber] === null ) return

    const osc = activeOsc[keyNumber]

    const now = ctx.currentTime
    const relDur = adsr.release * maxTime
    const relEnd = now + relDur

    osc[1].gain.cancelScheduledValues(now)

    osc[1].gain.setValueAtTime(osc[1].gain.value, now)
    osc[1].gain.linearRampToValueAtTime(0, relEnd)

    osc[0].stop(relEnd)
    activeOsc[keyNumber] = null
}


document.getElementById('control-gain').addEventListener('input', (e) => {
    settings.gain = parseFloat(e.target.value)
    masterGain.gain.setValueAtTime(parseFloat(e.target.value), ctx.currentTime)
    e.target.nextSibling.innerText = e.target.value
})
document.getElementById('control-attack').addEventListener('input', (e) => {
    adsr.attack = parseFloat(e.target.value)
    e.target.nextSibling.innerText = e.target.value
})
document.getElementById('control-decay').addEventListener('input', (e) => {
    adsr.decay = parseFloat(e.target.value)
    e.target.nextSibling.innerText = e.target.value
})
document.getElementById('control-sustain').addEventListener('input', (e) => {
    adsr.sustain = parseFloat(e.target.value)
    e.target.nextSibling.innerText = e.target.value
})
document.getElementById('control-release').addEventListener('input', (e) => {
    adsr.release = parseFloat(e.target.value)
    e.target.nextSibling.innerText = e.target.value
})

const comp = ctx.createDynamicsCompressor()
const beforeCompGain = ctx.createGain()
const masterGain = ctx.createGain()

beforeCompGain.connect(comp)
comp.connect(masterGain)
masterGain.connect(ctx.destination)

function createOsc(freq,shape){
    const gain = ctx.createGain()
    const osc = ctx.createOscillator()
    
    const now = ctx.currentTime
    const atkDur = adsr.attack * maxTime
    const atkEnd = now + atkDur
    const decayDur = adsr.decay * maxTime
    
    
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.25*settings.gain, atkEnd)
    gain.gain.setTargetAtTime(0.25*adsr.sustain*settings.gain, atkEnd, decayDur)
    
    osc.type = shape
    osc.frequency.value = freq
    
    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 1000
    filter.Q.value = 30

    if(settings.filter === true){
        osc.connect(filter)
        filter.connect(gain)
    }else{
        osc.connect(gain)
    }
    gain.connect(beforeCompGain)
    osc.start()
    return [osc,gain]
}