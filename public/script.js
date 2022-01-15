const socket = io();
let status = "Waiting";
socket.on("message", msg => {
    receiveMsg(msg);
});
function changeToNext() {
    $('#next-stop').text("Next");
    $('#next-stop').css("background-color","white");
    $('#next-stop').css("color","#2c3144");
    $('#next-stop').attr('onclick', 'nextnotstop()');
}
function changeToStop() {
    $('#next-stop').text("Stop");
    $('#next-stop').css("background-color","#2c3144");
    $('#next-stop').css("color","white");
    $('#next-stop').attr('onclick', 'stopnotnext()');
}
socket.on("events", evnt => {
    if(evnt=="connected"){
        $('.msg.bot').text("Connected to a stranger...");
        $('.message').removeAttr('disabled');
        changeToStop();
    }
    if(evnt=="disconnected"){
        $('.msg-box').not(':first').remove();
        $('.msg.bot').text("Disconnected from stranger...");
        $('.message').attr('disabled','disabled');
        changeToNext();

    }
    if(evnt=="waiting"){
        $('.msg.bot').text("Looking for Someone to chat with...");
        $('.message').attr('disabled','disabled');
        changeToStop();
    }
    if(evnt=="noRoom"){
        $('.msg.bot').text("Couldn't find Someone to chat with :(");
        $('.message').attr('disabled','disabled');
        changeToNext();
    }
})

$(document).ready(function () {
    if(getCookie("tags")!==""){
        let tags = getCookie("tags").split(',');
        tags.forEach(tagName => {
            $('.tags').append('<p id="tag">'+encodeURIComponent(tagName)+'<button><i class="fas fa-times-circle"></i></button></p>');

        });
    }

})
function stopnotnext() {
    $('.msg-box').not(':first').remove();
        $('.msg.bot').text("Disconnected from stranger...");
        $('.message').attr('disabled','disabled');
        changeToNext();
        socket.emit("events","disconnecting");
}
function nextnotstop() {
    $('.msg.bot').text("Looking for Someone to chat with...");
    $('.message').attr('disabled','disabled');
    changeToStop();
    socket.emit("events","reconecting");
}
let receiveMsg = (msg) => {
    var htmlToAppend = $(".chat-box p:last").hasClass("anon") ? '<div class="msg-box" style="margin-top:1px;"><p class="msg anon">'+msg+'</p></div>' : '<div class="msg-box"><p class="msg anon">'+msg+'</p></div>';
    $(".chat-box").append(htmlToAppend);
}
let writeMsg = (roomId) => {
    var msgToWrite = $(".message").val();
    var data = {msgToWrite,roomId};
    if(msgToWrite == ""){
        pass
    }else{
    var htmlToAppend = $(".chat-box p:last").hasClass("usr") ? '<div class="msg-box" style="margin-top:1px;"><p class="msg usr">'+msgToWrite+'</p></div>' : '<div class="msg-box"><p class="msg usr">'+msgToWrite+'</p></div>';
    Cookies.get('name');
    socket.emit("chatMessage",msgToWrite)
    $(".chat-box").append(htmlToAppend);
    $(".message").val("").focus();
    }
    return false;
}
$('.message').keydown(function(e){
    // Enter was pressed without shift key
    if (e.keyCode == 13 && !e.shiftKey)
    {
        // prevent default behavior
        e.preventDefault();
        writeMsg();
    }
    });

$('.tag').keydown(function(e){
        if (e.keyCode == 13 && !e.shiftKey)
        {
            e.preventDefault();
            console.log($('.tags').children().length);
            if($('.tags').children().length<3){
                addTag();
            }
        }
});
function addTag(){
    if($('.tag').val()){
        $('.tags').append('<p id="tag">'+encodeURIComponent($('.tag').val().substring(0, 20))+'<button><i class="fas fa-times-circle"></i></button></p>');
    }
    $('.tag').val('');
}


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }



$("#start-chat").click(function(){
    $(this).parent();
    let tags = [];
    if($('.tags').children().length>0){
        
        for (let i = 1; i <= $('.tags').children().length; i++) {
            tags.push($("#tag:nth-child("+i+")").html().substring(0,$("#tag:nth-child("+i+")").html().lastIndexOf("<button>")));
        }
    }

    setCookie("tags",encodeURIComponent(tags),99999);
    document.location.href = '/search'
});
$('#addtag').click(function(){
    addTag();
})    
$(".tags").on("click", "button", function(){
    $(this).parent().remove();
});

$(".chat-box").ready(function(){
    $(".chat-box").css();
});


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }