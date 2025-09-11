var listeningStart = new Audio("/sounds/airport-call-157168.mp3");
var listeningSpeak = new Audio();
var listSrc = [];
let firstElement= 0;

function speaker(src){
    if(src !==null){
        listSrc.push( src);
        if(listSrc.length==1){
            playThisSound();
        }
    }
    
}

let listaObserv = new Proxy(listSrc, {
  set(target, property, value) {
    console.log(`Cambio detectado: ${property} = ${value}`);
    target[property] = value;

    // Aquí puedes ejecutar código adicional
    return true;
  }
});

function playThisSound(){
    if(listSrc.length!==0){
        listeningSpeak.src= listSrc[firstElement];
        listeningSpeak.play();
        listSrc.shift();
    }
    
}
$(listeningSpeak).on("ended", function() {
        playThisSound();
  });