var userID, elAvatar, elFans, elScript, elName
var duration = 3000;
var flag = 0
const handleURL = new URLSearchParams(window.location.search)
function handle() {
    console.log(handleURL.has('uid'));
    if (handleURL.has('uid'))
        userID = handleURL.get('uid');
    else {
        window.alert("No UID, set default.");
        userID = 262453663
    }
}

const showFansCount = function (json) {
    elFans.innerHTML = json.data.follower
    if (flag < 1) {
        elAvatar.src = json.data.card.face.replace(/^http:/, 'https:')
        elName.innerHTML = json.data.card.name;
        changeIcon();
    }
    flag++;
}

const appendScript = function (father) {
    var elScriptChild
    const url = "https://jsonp.afeld.me/?callback=showFansCount&url=https%3A%2F%2Fapi.bilibili.com%2Fx%2Fweb-interface%2Fcard%3Fmid%3D" + userID + '&spam=' + Number(new Date)
    elScriptChild = document.createElement('script')
    elScriptChild.setAttribute('src', url)
    elScriptChild.setAttribute('type', "text/javascript")
    elScriptChild.setAttribute('referrerpolicy', "no-referrer")
    father.appendChild(elScriptChild)
}

const getData = function (father) {
    father.removeChild(father.childNodes[0])
    appendScript(father)
}

handle();

window.onload = function () {
    const subodometer = document.querySelector(".myOdometer");
    const odometer = new Odometer({
        el: subodometer,
        format: ',ddd',
        theme: 'default',
        duration: 200
    })
    elAvatar = document.getElementById('avatar')
    elFans = document.getElementById('fans')
    elScript = document.getElementById('script')
    elName = document.getElementById('name')
    appendScript(elScript);
    window.setInterval("getData(elScript)", duration);
}


const changeIcon = function () {
    icon = document.createElement('link');
    icon.href = elAvatar.src;
    icon.rel = "apple-touch-icon";
    icon.sizes = "114x114";
    document.getElementsByTagName('head')[0].appendChild(icon);
}
