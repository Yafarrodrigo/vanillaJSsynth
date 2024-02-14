import NoteValues from "./NoteValues.js"

export default class Keyboard{
    constructor(synth){
        this.synth = synth
        this.activeKeys = {}
        this.keyCodes = ["q","2","w","3","e","r","5","t","6","y","7","u","z","s","x","d","c","v","g","b","h","n","j","m",","]
        this.allNotes = []
        for(let note in NoteValues){
            this.activeKeys[note] = false
            this.allNotes.push(note)
        }
        this.mappings = {}
        this.keyCodes.forEach( (keyCode,index) => {
            this.mappings[keyCode] = this.allNotes[index]
        })
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