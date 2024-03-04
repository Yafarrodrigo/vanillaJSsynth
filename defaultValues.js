const defaultValues = {
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
        distFactor: 400,
        currentValue: 0
    },
    delay:{
        enabled: false,
        delayTime: 0.001,
        feedBack: 0.25
    },
    adsr: {
        attack: 0.001,
        decay: 0.001,
        sustain: 1,
        release: 0.1,
        maxTime: 2
    }
}

export default defaultValues