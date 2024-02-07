export default class Knob{
    constructor(name,min,max,step,defaultPercent, id){

        this.name = name
        this.min = min
        this.max = max
        this.step = step

        this.maxAngle = 90
        this.angle = this.defaultPercent * this.maxAngle

        this.rangeInput = document.createElement('input');
        this.rangeInput.type = 'range';
        this.rangeInput.step = step;
        this.rangeInput.min = min;
        this.rangeInput.max = max;
        this.rangeInput.value = max * defaultPercent;
        this.rangeInput.style.zIndex = "99999"
        //document.body.appendChild(this.rangeInput);

        this.moving = false

        this.elem = document.createElement('div')
        this.elem.id = id
        this.elem.classList.add("knob")
        document.body.appendChild(this.elem)
        this.subElem = document.createElement('div')
        this.subElem.classList.add("knobDot")
        this.elem.append(this.subElem)

        this.startDragPos = 0
        this.currentValue = max * defaultPercent
        this.currentPercent = defaultPercent
        this.prevDifValue = 0

        const dragInput = (e) => {
            if(this.moving === false) return

            const dif = (this.startDragPos - e.clientY)/500
            this.prevDifValue = Math.abs(dif)
            if(dif > this.prevDifValue){
                this.prevDifValue = dif
            }else{
                this.prevDifValue = 0
                this.startDragPos = e.clientY
            }
            if((this.currentValue + dif) > this.max) this.currentValue = this.max
            else if ((this.currentValue + dif) < this.min) this.currentValue = this.min
            else this.currentValue += dif

            this.rangeInput.value = this.currentValue
            this.currentPercent = this.currentValue * this.max

            this.angle = Math.floor(this.currentPercent * this.maxAngle*2) - (this.maxAngle)
            this.elem.style.transform = `rotate(${this.angle + 90 }deg)`

            console.log(this.name + ": "+ this.rangeInput.value)
        }

        this.elem.addEventListener('mousedown', (e) => {
            this.startDragPos = e.clientY
            this.moving = true
            window.addEventListener('mousemove', dragInput)
            window.addEventListener('mouseup', (e) => {
                this.moving = false
                this.prevDifValue = 0
                window.removeEventListener('mousemove', dragInput)
            })
        })
    }
}

