import NoteValues from "./NoteValues.js"

export default class Keyboard{
    constructor(synth){
        this.synth = synth
        this.activeKeys = {}
        for(let note in NoteValues){
            this.activeKeys[note] = false
        }
        this.mappings = {
            "q": "C4",
            "2": "C#4",
            "w": "D4",
            "3": "D#4",
            "e": "E4",
            "r": "F4",
            "5": "F#4",
            "t": "G4",
            "6": "G#4",
            "y": "A4",
            "7": "A#4",
            "u": "B4",
            "z": "C5",
            "s": "C#5",
            "x": "D5",
            "d": "D#5",
            "c": "E5",
            "v": "F5",
            "g": "F#5",
            "b": "G5",
            "h": "G#5",
            "n": "A5",
            "j": "A#5",
            "m": "B5",
            ",": "C6"
        }

        this.createListeners()
    }

    createListeners(){
        document.addEventListener('contextmenu', (e) => e.preventDefault())
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return 
            else this.checkDown(e)
        })
        document.addEventListener('keyup', (e) => {
            this.checkUp(e)
        })
    }

    checkDown(e){
        if(!Object.keys(this.mappings).includes(e.key.toLowerCase())){
            for(let key in this.activeKeys){
                this.activeKeys[key] = false
            }
            return
        }
        const note = this.mappings[e.key.toLowerCase()]
        this.activeKeys[note] = true
        this.synth.ui.press(note)
        if(this.synth.firstOscActiveNotes[note] === null){
            this.synth.noteOn(note ,NoteValues[note])
        }
    }

    checkUp(e){
        if(!Object.keys(this.mappings).includes(e.key.toLowerCase())) return
        const note = this.mappings[e.key.toLowerCase()]
        this.activeKeys[note] = false
        this.synth.ui.release(note)
        this.synth.noteOff(note)
    } 
}