function ResourceManager() {
    this.maps;//说明信息
    this.models;//说明信息
    this.mapsIndex;
    //
}
ResourceManager.prototype={
    init:function (resourceInfo) {
        this.maps=resourceInfo.maps;
        //fileName;modelName;
        for(i=0;i<this.maps.length;i++){
            this.maps[i].finishLoad=false;
            this.maps[i].modelFinishLoad=false;
        }
        this.models=resourceInfo.models;
        for(i=0;i<this.models.length;i++){
            this.models[i].finishLoad=false;
            this.models[i].inView=false;
        }
        //fileName;interest;boundingSphere{x,y,z,r};MapName;spaceVolume;
        this.mapsIndex=resourceInfo.mapsIndex;
    },
    getMapByName:function (name) {
        for(i=0;i<this.maps.length;i++){
            if(this.maps[i].fileName===name)
                return this.maps[i];
        }
    },
    getModeByName:function (name) {
        for(i=0;i<this.models.length;i++){
            if(this.models[i].fileName===name)
                return this.models[i];
        }
    },
}
