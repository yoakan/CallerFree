
var exampleUser;
function hideConnect(){
    $(".connectForm").attr("style", "display: none !important");
    $("#name").prop('disabled', true);
    $(".season").show();
}
function showConnect(){
    $(".connectForm").removeAttr( "style" );
    $('#name').removeAttr('disabled');
     $(".season").hide();
}
$(function () {
    exampleUser=$(".user-connected").clone();
    $("#exampleUser").attr("style", "display: none !important");
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