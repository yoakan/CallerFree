
var exampleUser;
function hideConnect(){
    $(".connect").hide();
    $(".season").show();
}
function showConnect(){
    $(".connect").show();
     $(".season").hide();
}
$(function () {
    exampleUser=$(".user-connected").clone();
    $(".user-connected").hide();
    $(".season").hide();

    }
);

function addUsers(users){
    users.forEach(element => {
        addUser(element)
    });
}
function addUser(nameUser){
    let userElement = exampleUser.clone();
        $(userElement).find(".name").text(nameUser)
        $(userElement).attr('id', nameUser);
        $("#listMainNames").append(userElement);
}
function removeUser(nameUser){
    $("#"+nameUser).removeUser();
}

function elementUserSpeak(nameUser){
    $("#"+nameUser).addClass("user-talk");
}
function elementUserNoSpeak(nameUser){
    $("#"+nameUser).removeClass("user-talk");
}