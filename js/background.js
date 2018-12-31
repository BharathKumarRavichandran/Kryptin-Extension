/*chrome.tabs.onRemoved.addListener(function(tabid, removed) {
    alert("tabclose");
    chrome.browserAction.setBadgeText({text: ""});
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
});

/*chrome.browserAction.setBadgeText({text: " "});
chrome.browserAction.setBadgeBackgroundColor({color: "#ffeb3b"});*/