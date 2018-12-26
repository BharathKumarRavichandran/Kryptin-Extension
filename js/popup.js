$(function(){

    var serverUrl    = "http://localhost:8000/api/"; // Add localhost alias as http://www.kryptin.com/ in /etc/hosts file due of CORS issue
    var username     = "foobar";
    var userToken    = '';
    var platform     = "";
    var course       = "";
    var onlineUsers  = [];
    var getOnlineUsers;
    var oppUsername  = "";

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

    function refreshOnlineUsers(){
        $.ajax({
            url: serverUrl+"user/online/get/",
            type: "POST",
            crossDomain: true,
            data: {
                "token"    : userToken,
                "platform" : platform,
                "course"   : course
            },
            success: function(data){
                if(data.status_code == 200){
                    onlineUsers = data.data;
                    appendOnlineUsers();
                }
            }
        });
    }

    function appendOnlineUsers(){
        if(onlineUsers){
            $.each(onlineUsers, function(index, onlineUser){
                $("#usersList").append('<div class="card list-container"><span><span id=onlineUsername'+index+' class="list-name">'+onlineUser['username']+'</span><button type="button" id=chatWith'+index+' class="btn material-raised-button chat-btn">Chat</button></span></div>');
            });    
        }
    }

    function onlineUsersScrollCheck(){
        var out = document.getElementById("usersList");
        var scrollToBottom = out.scrollTop + 1 <= out.scrollHeight - out.clientHeight;
        if(scrollToBottom){
            out.scrollTop = out.scrollHeight - out.clientHeight;
        }
    }

    function chatAreaScrollCheck(){
        var out = document.getElementById("chatArea");
        var scrollToBottom = out.scrollTop + 1 <= out.scrollHeight - out.clientHeight;
        if(scrollToBottom){
            out.scrollTop = out.scrollHeight - out.clientHeight;
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
    
    /*$("#chatBtn").on("click", function(){
        openPage('chatBtn', 'chatSection', 'blue');
    });*/

    var base     = document.querySelector("#usersList");
    var selector = ".chat-btn";

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
    
    $("#homeBtn").click();

    var getUIdPromise = new Promise(function (resolve, reject) {
        chrome.storage.sync.get('userToken', function(items) {
            userToken = items.userToken;
            if(!userToken){
                userToken = getRandomToken();
                chrome.storage.sync.set({userToken: userToken}, function() {
                    console.log("User token created")
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
    
                putOnline = true;
                platform  = "Coursera";
                course    = path[2];
               
            }
    
            else if(hostname == "www.udemy.com" && path[2] == "learn"){
    
                putOnline = true;
                platform  = "Udemy";
                course    = path[1];
    
            }

            else if(hostname == "classroom.udacity.com" && path[1] == "courses"){
    
                putOnline = true;
                platform  = "Udacity";
                course    = path[2];
    
            }
    
            if(putOnline){

                /*getOnlineUsers = new Promise(function (resolve, reject){

                    $.ajax({
                        url: serverUrl+"user/online/get/",
                        type: "POST",
                        crossDomain: true,
                        data: {
                            "username" : username,
                            "platform" : platform,
                            "course"   : course
                        },
                        success: function(data){
                            if(data.status_code == 200){
                                onlineUsers = data.data;
                                appendOnlineUsers();
                            }
                        }
                    });
                });*/

                refreshOnlineUsers();

                $("#username").html(username);
                $("#usernameGreet").html(username);
                $("#platform").html(platform);
                $("#coursename").html(course);

                $("#section1").css("display", "none");
                $("#section2").css("display","block");

                $("#onlineBtn").css("backgroundColor", "#0074D9");
                $("#onlineBtn").prop('disabled', false);
                
                $.ajax({
                    url: serverUrl+"user/online/put/",
                    type: "POST",
                    crossDomain: true,
                    data: {
                        "username" : username,
                        "token"    : userToken,
                        "platform" : platform,
                        "course"   : course
                    },
                    success: function(data){
                        if(data.status_code == 200){
                            console.log(data.data); // success message should be "User status made online" or "User created and status made online"
                        }
                    }
                });
                
            }
    
        });
    });

});
