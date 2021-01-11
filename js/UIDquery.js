(function () {
    let handleURL = new URLSearchParams(window.location.search)
    if (handleURL.has('uid')) {

        if (/[0-9]{1,11}$/.test(handleURL.get('uid'))) {
            userID = handleURL.get('uid');
        }
        else {
            window.alert("Param is not legit.");
            window.location.href = 'index.html';
        }
    }
    else {
        window.alert("No UID.");
        window.location.href = 'index.html';
    }
})();

var userID, duration = 3000;
$(function () {
    const subodometer = document.querySelector(".myOdometer");
    const odometer = new Odometer({
        el: subodometer,
        format: ',ddd',
        theme: 'default',
        duration: 200
    })
    var $elScript = $('#script')
    //var url = "https://jsonp.afeld.me/?callback=showFansCount&url=https%3A%2F%2Fapi.bilibili.com%2Fx%2Fweb-interface%2Fcard%3Fmid%3D" + userID + '&spam=' + Number(new Date)
    var url2 = "https://api.codetabs.com/v1/proxy/?quest=api.bilibili.com/x/web-interface/card?mid=" + userID + '&spam=' + Number(new Date)
    const appendScript = function () {
        let elScriptChild = document.createElement('script')
        elScriptChild.setAttribute('src', url)
        elScriptChild.setAttribute('type', "text/javascript")
        elScriptChild.setAttribute('referrerpolicy', "no-referrer")
        elScript.appendChild(elScriptChild)
    }
    const appendScript2 = function() {
        $.getJSON(url2, function(e){
        console.log(e)
        $('body').append("<script id='appendData'>showFansCount("+JSON.stringify(e)+")</script>")
    })}

    appendScript2();
    setInterval(function () {
        $("#appendData").remove();
        appendScript2();
    }, duration);

    //appendScript();
    //window.setInterval(function () {
    //    elScript.removeChild(elScript.childNodes[0])
    //    appendScript()
    //}, duration);
}
)