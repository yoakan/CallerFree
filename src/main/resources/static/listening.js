var listeningStart = new Audio("/sounds/airport-call-157168.mp3");
var listeningSpeak = new Audio();
var listNameSrcs = {
    unname:{
        listener:new Audio(),
        Srcs:[]
    }
};
let firstElement= 0;

function speaker(src,name){
    if(src !==null){
        if(!listNameSrcs.hasOwnProperty(name)){
            listNameSrcs[name] ={
                listener:new Audio(),
                listSrc:[]
            }
            listNameSrcs[name].listener.subname= name;
        }
        listNameSrcs[name].listSrc.push( src);
        if(listNameSrcs[name].listSrc.length==1){
            playThisSound(name);
        }
    }
    
}

/*let listaObserv = new Proxy(listSrc, {
  set(target, property, value) {
    console.log(`Cambio detectado: ${property} = ${value}`);
    target[property] = value;

    // Aquí puedes ejecutar código adicional
    return true;
  }
});*/

function playThisSound(name){
    if(listNameSrcs[name].listSrc.length!==0){
        listNameSrcs[name].listener.src= listNameSrcs[name].listSrc[firstElement];
        listNameSrcs[name].listener.play();
        listNameSrcs[name].listSrc.shift();
        
        $(listNameSrcs[name].listener).on("ended", function() {
             
            playThisSound(this.subname);
        });
    }
    
}
