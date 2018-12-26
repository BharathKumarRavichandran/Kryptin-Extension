$(function(){

    var server_url   = "http://localhost:8000/api/"; // Add localhost alias as http://www.kryptin.com/ in /etc/hosts file due of CORS issue
    var username     = "foobar";
    var user_token   = '';
    var platform     = "";
    var course_name  = "";
    var online_users = [];
    var get_online_users;
    var oppUsername  = "";

    function openPage(btn_id, section_id, color) {

        var i;
        var btn        = $("#"+btn_id);
        var tablinks   = $(".tablink");
        var section    = $("#"+section_id);
        var tabcontent = $(".tabcontent");
        
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
    
        document.getElementById(section_id).style.display = "block";
    
        document.getElementById(btn_id).style.backgroundColor = color;
    
    }

    function refresh_online_users(){
        $.ajax({
            url: server_url+"user/online/get/",
            type: "POST",
            crossDomain: true,
            data: {
                "username" : username,
                "platform" : platform,
                "course"   : course_name
            },
            success: function(data){
                if(data.status_code == 200){
                    online_users = data.data;
                    append_online_users();
                }
            }
        });
    }

    function append_online_users(){
        if(online_users){
            $.each(online_users, function(index, online_user){
                $("#usersList").append('<div class="card list-container"><span><span id=onlineUsername'+index+' class="list-name">'+online_user['username']+'</span><button type="button" id=chatWith'+index+' class="btn material-raised-button chat-btn">Chat</button></span></div>');
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

            console.log("Start your chat with "+oppUsername);

            $("#chatBtn").css("backgroundColor", "blue");
            $("#chatBtn").prop('disabled', false);

            openPage('chatBtn', 'chatSection', 'blue');

            $("#oppUsername").html(oppUsername);
            $("#oppStatus").html("online");

        }

    });
    
    $("#homeBtn").click();

    var get_uid_promise = new Promise(function (resolve, reject) {
        chrome.storage.sync.get('user_token', function(items) {
            user_token = items.user_token;
            if(!user_token){
                user_token = getRandomToken();
                chrome.storage.local.set({user_token: user_token}, function() {
                });
            }
            resolve(user_token);
        });
    });

    get_uid_promise.then(function (user_token) {

        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        
            const absurl = tabs[0].url;
    
            const url = document.createElement('a');
            url.setAttribute('href',absurl);
    
            const hostname    = url.hostname;
            const pathname    = url.pathname;
    
            const path = pathname.split('/');
    
            var put_online = false;
            
            if(hostname == "www.coursera.org" && path[1] == "learn"){
    
                put_online = true;
                platform = "Coursera";
                course_name  = path[2];
               
            }
    
            else if(hostname == "www.udemy.com" && path[2] == "learn"){
    
                put_online = true;
                platform = "Udemy";
                course_name = path[1];
    
            }

            else if(hostname == "classroom.udacity.com" && path[1] == "courses"){
    
                put_online = true;
                platform = "Udacity";
                course_name = path[2];
    
            }
    
            if(put_online){

                /*get_online_users = new Promise(function (resolve, reject){

                    $.ajax({
                        url: server_url+"user/online/get/",
                        type: "POST",
                        crossDomain: true,
                        data: {
                            "username" : username,
                            "platform" : platform,
                            "course"   : course_name
                        },
                        success: function(data){
                            if(data.status_code == 200){
                                online_users = data.data;
                                append_online_users();
                            }
                        }
                    });
                });*/

                refresh_online_users();

                $("#username").html(username);
                $("#usernameGreet").html(username);
                $("#platform").html(platform);
                $("#coursename").html(course_name);

                $("#section1").css("display", "none");
                $("#section2").css("display","block");

                $("#onlineBtn").css("backgroundColor", "#0074D9");
                $("#onlineBtn").prop('disabled', false);
                /*$("#chatBtn").css("backgroundColor", "blue");
                $("#chatBtn").prop('disabled', false);*/
                
                $.ajax({
                    url: server_url+"user/online/put/",
                    type: "POST",
                    crossDomain: true,
                    data: {
                        "username" : username,
                        "token"    : user_token,
                        "platform" : platform,
                        "course"   : course_name
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
