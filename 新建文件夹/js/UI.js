function UI() {

    this.button_material;//网格模式
    this.button_material2;//起始帧
}
UI.prototype={

    init:function () {
        this.button_material=new ButtonP("网格模式","#3498DB",'#2980B9',10,6,100,40);
        this.button_material.rePos(500,5);

        this.button_material2=new ButtonP("起始帧","#3498DB",'#2980B9',10,6,100,40);
        this.button_material2.rePos(610,5);
    }
}