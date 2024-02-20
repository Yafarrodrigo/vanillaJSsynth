export default class Knob{
    constructor(name,min,max,step,defaultPercent){

        this.name = name
        this.min = min
        this.max = max
        this.step = step

        this.maxAngle = 135
        this.angle = Math.floor(defaultPercent * this.maxAngle*2) - (this.maxAngle)
        
        this.rangeInput = document.createElement('input');
        this.rangeInput.type = 'range';
        this.rangeInput.step = step;
        this.rangeInput.min = min;
        this.rangeInput.max = max;
        this.rangeInput.value = max * defaultPercent;
        this.rangeInput.style.zIndex = "99999"
        this.rangeInput.id = name
        document.body.appendChild(this.rangeInput);
        
        this.moving = false
        
        this.elem = document.createElement('div')
        this.elem.classList.add("knob")
        
        this.elem.style.transform = `rotate(${this.angle + 90 }deg)`       
        document.body.appendChild(this.elem)

        this.subElem = document.createElement('div')
        this.subElem.classList.add("knobDot")
        this.elem.append(this.subElem)

        this.elem.style.transform = `rotate(${this.angle + 90 }deg)`

        this.startDragPos = 0
        this.value = max * defaultPercent
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
            if((this.value + dif) > this.max) this.value = this.max
            else if ((this.value + dif) < this.min) this.value = this.min
            else this.value += dif

            this.rangeInput.value = this.value
            this.rangeInput.dispatchEvent(new Event('change'))

            this.currentPercent = this.value * this.max

            this.angle = Math.floor(this.currentPercent * this.maxAngle*2) - (this.maxAngle)
            this.elem.style.transform = `rotate(${this.angle + 90 }deg)`
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

       /*  return {knob: this.elem, rangeElem:this.rangeInput} */
    }
}

