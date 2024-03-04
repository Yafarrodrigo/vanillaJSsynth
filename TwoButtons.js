export default class TwoButtons{
    constructor(name, func, func2){
        this.name = name

        this.container = document.createElement('div')
        this.container.id = name
        this.container.classList.add('twoButtons-container')

        this.elem = document.createElement('div')
        this.elem.id = name+"-1"
        this.elem.classList.add('twoButtons-1')
        this.elem.innerText = "+1 Oct"
        
        this.elem2 = document.createElement('div')
        this.elem2.id = name + "-2"
        this.elem2.classList.add('twoButtons-2')
        this.elem2.innerText = "-1 Oct"

        this.elem.addEventListener('click', func)
        this.elem2.addEventListener('click', func2)

        this.container.append(this.elem, this.elem2)
    }
}