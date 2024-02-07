export default class Selector{
    constructor(name,values,defaultValue,id){
        this.name = name
        this.values = values

        this.currentIndex = this.values.indexOf(defaultValue)
        this.currentValue = defaultValue
        
        this.elem = document.createElement('div')
        this.elem.id = id
        this.elem.addEventListener('click', (e) => {
            if((this.currentIndex + 1) >= this.values.length){
                this.currentIndex = 0
            }else{
                this.currentIndex++
            } 
            this.currentValue = this.values[this.currentIndex]
            console.log(this.name + ": "+ this.currentValue)
        })
        document.body.appendChild(this.elem)
    }
}