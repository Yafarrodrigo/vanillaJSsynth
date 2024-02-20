export default class Selector{
    constructor(name,values,defaultValue,func){
        this.name = name
        this.values = values

        this.currentIndex = this.values.indexOf(defaultValue)
        this.value = defaultValue
        
        this.elem = document.createElement('div')
        this.elem.classList.add('selector')
        this.elem.id = name
        this.elem.addEventListener('click', func)
    }
}