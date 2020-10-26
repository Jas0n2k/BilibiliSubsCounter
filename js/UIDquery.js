window.onload = function () {
    var userID, duration = 3000;
    elAvatar = document.getElementById('avatar')
    elFans = document.getElementById('fans')
    elScript = document.getElementById('script')
    elName = document.getElementById('name')

    function handle() {
        let handleURL = new URLSearchParams(window.location.search)
        if (handleURL.has('uid'))
            userID = handleURL.get('uid');
        else {
            window.alert("No UID, set default.");
            userID = 262453663;
        }
    }
    handle();

    const appendScript = function (father) {
        let url = "https://jsonp.afeld.me/?callback=showFansCount&url=https%3A%2F%2Fapi.bilibili.com%2Fx%2Fweb-interface%2Fcard%3Fmid%3D" + userID + '&spam=' + Number(new Date)
        let elScriptChild = document.createElement('script')
        elScriptChild.setAttribute('src', url)
        elScriptChild.setAttribute('type', "text/javascript")
        elScriptChild.setAttribute('referrerpolicy', "no-referrer")
        father.appendChild(elScriptChild)
    }

    const subodometer = document.querySelector(".myOdometer");
    const odometer = new Odometer({
        el: subodometer,
        format: ',ddd',
        theme: 'default',
        duration: 200
    })

    appendScript(elScript);
    window.setInterval(function(){
        elScript.removeChild(elScript.childNodes[0])
        appendScript(elScript)
    }, duration);
}
