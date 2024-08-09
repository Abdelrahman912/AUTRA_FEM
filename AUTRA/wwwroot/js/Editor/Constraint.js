class Constraint{
    constructor(ux,uy,uz){
        this.free = [ux,uy,uz]; //bool values (true -> free, false -> fixed)
    }
}