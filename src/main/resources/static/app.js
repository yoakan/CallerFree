var stompClient = null;
var listNames=[];
var lastBase64 = [];

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
        //recive los mensajes
        stompClient.subscribe('/topic/user/message', function (greeting) {
            let user =JSON.parse(greeting.body);
            let voiceExist= lastBase64.indexOf( user.voice);
            let voice;
            let audio;
            if(user.voice.includes("Finish session")){
                listNames.splice(listNames.indexOf(user.name),1)
            }else if(voiceExist ===-1){
                voice= base64ToBlob(user.voice, "audio/webm");
                audio = URL.createObjectURL(voice);
                speaker(audio,user.name);
            }else{
                lastBase64.splice(voiceExist,1)
            }
            checkNames(user.name);
        });
        addNames();
        listeningStart.play();
        hideConnect();
    });

}

function addNames(){
    $.get( "/users", function( data ) {
        listNames = data;
        addUsers(listNames);
    });
}
function checkNames(name){
    if(!listNames.includes(name)){
        listNames.push(name);
        addUser(name)
    }
}
function deleteName(){
    $.ajax({
        url: 'users/'+$("#name").val(),
        method: 'DELETE',
        dataType: 'json',
        success: function(data) {
            console.log("Sucessfull");
        }
    }
    );
}
function disconnect() {
    if (stompClient !== null) {
        deleteName();
        stompClient.disconnect();
        showConnect();
    }
    setConnected(false);
    console.log("Disconnected");
}


async function sendVoice(voice){
    if(stompClient !==null){
        const base64 = await blobToBase64(voice);
        lastBase64.push(base64);
        stompClient.send("/app/user/message", {}, JSON.stringify(
            {'name': $("#name").val(),'voice':
                base64
            }));
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