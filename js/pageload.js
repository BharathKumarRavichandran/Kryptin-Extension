/*$(function(){

    alert("page loaded");
    console.log('page loaded');

    chrome.tabs.onRemoved.addListener(function(tabid, removed) {
        username="acs";
        userToken="csa";
        $.ajax({
            url: serverUrl+"user/offline/put/all/",
            type: "POST",
            crossDomain: true,
            data: {
                "username"   : username,
                "token"      : userToken,
            },
            success: function(data){
                if(data.status_code == 200){
                    console.log(data.data); // success message should be "User status made online" or "User created and status made online"
                }
            }
        });

    });

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

});

chrome.tabs.onActivated.addListener(function (){
    alert("activated");
});

chrome.windows.onRemoved.addListener(function(windowid) {
    alert("window closed");
    username="acs";
    userToken="csa";
    $.ajax({
        url: serverUrl+"user/offline/put/all/",
        type: "POST",
        crossDomain: true,
        data: {
            "username"   : username,
            "token"      : userToken,
        },
        success: function(data){
            if(data.status_code == 200){
                console.log(data.data); // success message should be "User status made online" or "User created and status made online"
            }
        }
    });
});*/