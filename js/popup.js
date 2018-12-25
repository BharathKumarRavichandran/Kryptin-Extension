$(function(){

    var server_url   = "http://www.kryptin.com/api/"; // Add localhost alias as http://www.kryptin.com/ in /etc/hosts file due of CORS issue
    var username     = "some_random_shit_for_now";
    var user_token   = '';
    var platform     = "";
    var course_name  = "";
    var online_users  = [];
    var get_online_users;

    var views = chrome.extension.getViews({ type: "popup" });

    function openPage(btn_id, section_id, color) {

        var i;
        var btn        = $("#"+btn_id);
        var tablinks   = $(".tablink");
        var section    = $("#"+section_id);
        var tabcontent = $(".tabcontent");
        
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].style.backgroundColor = "grey";
        }
    
        document.getElementById(section_id).style.display = "block";
    
        document.getElementById(btn_id).style.backgroundColor = color;
    
    }

    function append_online_users(){

        for(var i=0; i<online_users.length; i++){
            $("#usersList").append("<div>"+online_users[i]+"</div>");
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
    });
    
    $("#onlineBtn").on("click", function(){
        openPage('onlineBtn', 'onlineSection', '#0074D9');
        append_online_users();
    });
    
    $("#chatBtn").on("click", function(){
        openPage('chatBtn', 'chatSection', 'blue');
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
    
            if(put_online && views.length>0){

                get_online_users = new Promise(function (resolve, reject){

                    data = {
                        "platform" : platform,
                        "course"   : course_name
                    };

                    $.ajax({
                        url: server_url+"user/online/get/",
                        type: "POST",
                        crossDomain: true,
                        dataType: "jsonp",
                        jsonp: false,
                        data: {
                            "platform" : platform,
                            "course"   : course_name
                        },
                        success: function(data){
                            if(data.status_code == 200){
                                online_users = data.message;
                            }
                        }
                    });
                });

                $("#username").html(username);
                $("#platform").html(platform);
                $("#coursename").html(course_name);

                $("#section1").style.display = "none";
                $("#section2").style.display = "block";

                document.getElementById("onlineBtn").setAttribute("disabled", "false");
                document.getElementById("onlineBtn").style.backgroundColor = "green";

                $("#username").html(username);
                $("#platform").html(platform);
                $("#coursename").html(course_name);
                    
                $.ajax({
                    url: server_url+"user/online/put/",
                    type: "POST",
                    crossDomain: true,
                    dataType: 'jsonp',
                    data: {
                        "username" : username,
                        "token"    : user_token,
                        "platform" : platform,
                        "course"   : course_name
                    },
                    success: function(data){
                        if(data.status_code == 200){
                            console.log(data.message); // success message should be "User status made online"
                        }
                    }
                });
                
            }
    
        });
    });

});
