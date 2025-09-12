
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
        $(userElement).find("name").text(nameUser)
        $(userElement).attr('id', nameUser);
        $("listMainNames").append(nameUser);
}
function removeUser(nameUser){
    $("#"+nameUser).removeUser();
}