$(function(){

    var serverUrl    = "https://127.0.0.1:8000/api/"; // Add localhost alias as http://www.kryptin.com/ in /etc/hosts file due of CORS issue
    var userToken    = "";
    var username     = "";
    var platform     = "";
    var coursename   = "";
    var onlineUsers  = [];
    var getOnlineUsers;
    var oppUsername  = "";

    var endpoint = ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/ws";
    var loc      = window.location;
    var wsStart  = 'ws://' + loc.host + loc.pathname;
    if(loc.protocol = 'https:'){
        wsStart = 'wss://'
    }
    var socket   = new WebSocket("wss://127.0.0.1:8001/api/user/chat/");


    var base     = document.querySelector("#usersList");
    var selector = ".chat-btn";

    var getUsernamePromise;
    var saveUsernamePromise;
    var getUIdPromise;


    $("#homeBtn").on("click", function(){
        openPage('homeBtn', 'homeSection', 'tomato');
        $("#chatBtn").css("backgroundColor", "grey");
        $("#chatBtn").prop('disabled', true);
    });

    $("#onlineBtn").on("click", function(){
        openPage('onlineBtn', 'onlineSection', '#0074D9');
        $("#chatBtn").css("backgroundColor", "grey");
        $("#chatBtn").prop('disabled', true);
    });

    socket.onopen = function(e){
        console.log("Socket connection opened", e);
        var msg = "Socket connection opened";
        var data = {
            'message': msg
        }
        socket.send(JSON.stringify(data));
    }

    socket.onmessage = function(e){
        console.log("Socket connection data received", e);
        receivedData = e.data;

        fromUsername = receivedData.from_username;
        toUsername   = receivedData.to_username;

        if(toUsername == username){
            onlineUsersList = $(".list-name");
            onlineUsersList.forEach((element,index) => {
                if(element.html() == fromUsername){
                    $("#chatWith"+index).click();
                    receivedMessage = receivedData.message;
                    appendOppMessage(receivedMessage);
                    break;
                }
            });
        }
    }

    socket.onerror = function(e){
        console.log("Socket connection error", e);
    }

    socket.onclose = function(e){
        console.log("Socket connection closed", e);

        receivedData = e.data;

        fromUsername = receivedData.from_username;
        toUsername   = receivedData.to_username;

        if(toUsername == username){
            onlineUsersList = $(".list-name");
            onlineUsersList.forEach((element,index) => {
                if(element.html() == fromUsername){
                    $("#chatWith"+index).click();
                    receivedMessage = receivedData.message;
                    appendOppMessage(receivedMessage);
                    break;
                }
            });
        }
    }

    function getRandomToken() {
        var randomPool = new Uint8Array(32);
        crypto.getRandomValues(randomPool);
        var hex = '';
        for (var i = 0; i < randomPool.length; ++i) {
            hex += randomPool[i].toString(16);
        }
        return hex;
    }

    function openPage(btnId, sectionId, color) {

        var i;
        var btn        = $("#"+btnId);
        var tablinks   = $(".tablink");
        var section    = $("#"+sectionId);
        var tabcontent = $(".tabcontent");
        
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        document.getElementById(sectionId).style.display = "block";

        document.getElementById(btnId).style.backgroundColor = color;

    }

    function refreshOnlineUsers(userToken, platform, coursename){
        $.ajax({
            url: serverUrl+"user/online/get/",
            type: "POST",
            crossDomain: true,
            data: {
                "token"      : userToken,
                "platform"   : platform,
                "coursename" : coursename
            },
            success: function(data){
                if(data.status_code == 200){
                    onlineUsers = data.data;
                    appendOnlineUsers();
                }
            }
        });
    }

    function putUserOnline(username, userToken, platform, coursename){
        $.ajax({
            url: serverUrl+"user/online/put/",
            type: "POST",
            crossDomain: true,
            data: {
                "username"   : username,
                "token"      : userToken,
                "platform"   : platform,
                "coursename" : coursename
            },
            success: function(data){
                if(data.status_code == 200){
                    console.log(data.data); // success message should be "User status made online" or "User created and status made online"
                }
            }
        });
    }

    function divScrollToBottom(selector){
        $(selector).scrollTop($(selector).prop("scrollHeight"));
    }

    function appendOnlineUsers(){
        if(onlineUsers){
            $.each(onlineUsers, function(index, onlineUser){
                $("#usersList").append('<div class="card list-container"><span><span id=onlineUsername'+index+' class="list-name">'+onlineUser['username']+'</span><button type="button" id=chatWith'+index+' class="btn material-raised-button chat-btn">Chat</button></span></div>');
            });
            divScrollToBottom("#usersList");
        }
    }

    function appendUserMessage(message){
        $("#chatArea").append('<div class="speech-bubble speech-bubble-right">'+message+'</div>');
        divScrollToBottom("#chatArea");
    }

    function appendOppMessage(message){
        $("#chatArea").append('<div class="speech-bubble speech-bubble-left">'+message+'</div>');
        divScrollToBottom("#chatArea");
    }


    function main(){

        base.addEventListener('click', function(event){

            if(event.target.closest(selector) && event.target.classList.contains('chat-btn') && event.target.id.includes("chatWith") ){
                
                var idAttr = event.target.id;
                var res = idAttr.split("chatWith");
                var k = parseInt(res[1]);
        
                oppUsername = $("#onlineUsername"+k).html();
        
                console.log("Chat box with "+oppUsername+" opened");
        
                $("#chatBtn").css("backgroundColor", "blue");
                $("#chatBtn").prop('disabled', false);
        
                openPage('chatBtn', 'chatSection', 'blue');
        
                $("#oppUsername").html(oppUsername);
                $("#oppStatus").html("online");
        
            }
        
        });

        $("#chatInput").on("keyup", (event) =>{
            if(event.keyCode == 13){
                sendMessage = $("#chatInput").val();
                $("#chatInput").val("");
                if(sendMessage){
                    appendUserMessage(sendMessage);
                    var data = {
                        "fromUsername" : username,
                        "toUsername"   : oppUsername,
                        "message"      : sendMessage 
                    }
                    var sendData = {
                        "data" : data
                    }
                    socket.send(JSON.stringify(sendData));
                }
            }
        });

        getUIdPromise = new Promise(function (resolve, reject) {
            chrome.storage.local.get('userToken', function(items) {
                userToken = items.userToken;
                if(!userToken){
                    userToken = getRandomToken();
                    console.log("User token created");
                    chrome.storage.local.set({userToken: userToken}, function() {
                        console.log("User token saved");
                    });
                }
                else{
                    console.log("User token retrieved")
                }
                resolve(userToken);
            });
        });

        getUIdPromise.then(function (userToken) {

            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            
                const absurl = tabs[0].url;
        
                const url = document.createElement('a');
                url.setAttribute('href',absurl);
        
                const hostname    = url.hostname;
                const pathname    = url.pathname;
        
                const path = pathname.split('/');
        
                var putOnline = false;
                
                if(hostname == "www.coursera.org" && path[1] == "learn"){
        
                    putOnline  = true;
                    platform   = "Coursera";
                    coursename = path[2];
                
                }
        
                else if(hostname == "www.udemy.com" && path[2] == "learn"){
        
                    putOnline  = true;
                    platform   = "Udemy";
                    coursename = path[1];
        
                }

                else if(hostname == "classroom.udacity.com" && path[1] == "courses"){
        
                    putOnline  = true;
                    platform   = "Udacity";
                    coursename = path[2];
        
                }
        
                if(putOnline){

                    /*getOnlineUsers = new Promise(function (resolve, reject){

                        $.ajax({
                            url: serverUrl+"user/online/get/",
                            type: "POST",
                            crossDomain: true,
                            data: {
                                "username"   : username,
                                "platform"   : platform,
                                "coursename" : coursename
                            },
                            success: function(data){
                                if(data.status_code == 200){
                                    onlineUsers = data.data;
                                    appendOnlineUsers();
                                }
                            }
                        });
                    });*/

                    refreshOnlineUsers(userToken, platform, coursename);

                    $("#username").html(username);
                    $("#usernameGreet").html(username);
                    $("#platform").html(platform);
                    $("#coursename").html(coursename);

                    $("#section1").css("display", "none");
                    $("#section2").css("display","block");

                    $("#onlineBtn").css("backgroundColor", "#0074D9");
                    $("#onlineBtn").prop('disabled', false);
                    
                    putUserOnline(username, userToken, platform, coursename);
                    
                }
        
            });
        });

    }

    getUsernamePromise = new Promise(function (resolve, reject) {
        chrome.storage.local.get('username', function(items) {
            username = items.username;
            if(username){
                console.log("Username retrieved");
                $("#section1").css("display", "block");
                $("#section3").css("display", "none");
                $("#usernameGreet").html(username);
                resolve(username);
            }
            else{
                $("#section1").css("display", "none");
                $("#section2").css("display", "none");
                $("#section3").css("display", "block");
                reject();
            }
        });
    });

    getUsernamePromise.then(function (data){
        main();
    }, function() {
        $("#usernameSubmit").on("click", ()=>{
            saveUsernamePromise = new Promise( (resolve, reject) =>{
                username = $("#usernameInput").val();
                chrome.storage.local.set({username: username}, function() {
                    console.log("Username saved")
                });
                $("#usernameInput").val("");
                $("#usernameGreet").html(username);
                $("#section1").css("display", "block");
                $("#section3").css("display", "none");
                main();
            });
        });
    });

    $("#homeBtn").click();

});