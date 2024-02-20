export default class Switch{
    constructor(name,defaultValue, func){
        this.name = name
        this.value = defaultValue

        this.elem = document.createElement('div')
        this.elem.id = name
        this.elem.classList.add('switch')

        this.elem.addEventListener('click', func)
    }
}