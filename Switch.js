export default class Switch{
    constructor(name,defaultValue,id){
        this.name = name
        this.value = defaultValue

        this.elem = document.createElement('div')
        this.elem.id = id

        this.elem.addEventListener('click', (e) => {
            this.value === 0 ? this.value = 1 : this.value = 0
            console.log(this.name + ": "+ this.value)
        })

        document.body.append(this.elem)
    }
}