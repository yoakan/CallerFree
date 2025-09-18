

var stompClient = null;
var listNames=[];
var nomUsed;
const finishSessionMsg= "Finish session";
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#userinfo").html("");
}

function connect() {
    var socket = new SockJS('/websocket-example');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        addMyName()
        //recive los mensajes
        stompClient.subscribe('/topic/user/message', function (greeting) {
            let user =JSON.parse(greeting.body);

            let voice;
            let audio;
            if(user.voice.includes(finishSessionMsg)){
                listNames.splice(listNames.indexOf(user.name),1)
                listeningFinish.play();
                removeUser(user.name);
            }else if(user.voice !==""){
                voice= base64ToBlob(user.voice, "audio/webm");
                audio = URL.createObjectURL(voice);
                speaker(audio,user.name);
            }else{
                checkNames(user.name);
            }
            
        });
        getNames();
        listeningStart.play();
        hideConnect();
    });

}

function getNames(){
    $.get( "/usersGest", function( data ) {
        listNames = data;
        addUsers(listNames);
    });
}
function addMyName(){
    $.get( "/usersGest/"+$("#name").val(), function( data ) {
        console.log("Sucessfull");
        sendMessage("");
    });
}
function checkNames(name){
    if(!listNames.includes(name)){
        listNames.push(name);
        addUser(name)
    }
}
function deleteClient(){
    $.ajax({
        url: 'usersGest/'+$("#name").val(),
        method: 'DELETE',
        success: function(result) {
            console.log("Sucessfull");
            sendMessage(finishSessionMsg);
            stompClient.disconnect() ;
        },
         error: function(result) {
            console.log("Sucessfull");
            sendMessage(finishSessionMsg);
            stompClient.disconnect() ;
        },
    }
    );
}
function disconnect() {
    if (stompClient !== null) {
        deleteClient();
        removeSpeakers();
        listeningFinish.play();
        showConnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage(value){
    stompClient.send("/app/user/message", {}, JSON.stringify(
            {'name': $("#name").val(),'voice':
                value
            }));
}
async function sendVoice(voice){
    if(stompClient !==null){
        const base64 = await blobToBase64(voice);
        nomUsed =$("#name").val();
        sendMessage(base64);
    }
    
}

function showGreeting(message) {
    $("#userinfo").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });


});


function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
function base64ToBlob(base64, contentType = "application/octet-stream") {
  const byteCharacters = atob(base64); // decodificar base64 → string binario
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

$(window).on('beforeunload', function() {
    disconnect();
    return '';
});