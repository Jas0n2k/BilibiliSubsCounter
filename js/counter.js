const avatar = document.getElementById("c-avatar");
const nickname = document.getElementById("c-nickname");
const odometer = document.getElementById("odometer");
const titleBar = document.getElementById("titleBar");
const overlayInitDialogCB = document.getElementById("overlayInitDialogCB")
const overlaySettingsCB = document.getElementById("overlaySettingsCB");
const goBtn = document.getElementById("goBtn");
const updateToggle = document.getElementById("updateToggle");
const reduceMotionTg = document.getElementById("reduceMotion");
const flag = {
    keepUpdating: () => updateToggle.checked,
    isPaused: () => !(overlaySettingsCB.checked),
    isVisible: true
};
let userID;
let handleURL = new URLSearchParams(window.location.search)
let updateInterval = 3000;
let retryTimes = 2;


const JSONP_API = [
    "https://jsonp.afeld.me/?url=",
    "https://api.codetabs.com/v1/proxy/?quest="
]

const bilibiliAPI = (uid) => "https://api.bilibili.com/x/web-interface/card?mid=" + uid + '&spam=' + Number(new Date);


const fetchWithTimeout = (url, options, timeout = 5000) => new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timer = ms => new Promise(() => setTimeout(() => controller.abort(), ms));
    const res = fetch(url, {
        ...options,
        signal: controller.signal
    });
    Promise.race([timer(timeout), res])
        .then(res => resolve(res))
        .catch(e => {
            if (e.name === "AbortError") reject(new Error('Request Timeout'));
            else reject(e);
        })
})

const getInfo = UID => new Promise((resolve, reject) => {
    fetchWithTimeout(JSONP_API[1] + bilibiliAPI(UID), {
        method: "GET",
        referrerPolicy: "no-referrer"
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else throw new Error("Fetch Result is Not OK!")
        })
        .then(res => {
            if (Number(res.code) !== 0) {
                let customErr = new Error(res.message);
                customErr.code = res.code;
                throw customErr;
            } else {
                resolve({
                    avatarURL: res["data"]["card"]["face"],
                    nickname: res["data"]["card"]["name"],
                    follower: res["data"]["follower"]
                })
            }
        })
        .catch(e => reject(e))
})

const getInfoWithRetry = (UID, retryTimes = 3) => new Promise(((resolve, reject) => {
    function attempt() {
        getInfo(UID)
            .then(resolve)
            .catch(e => {
                if (e.message === "UID NOT LEGIT") reject(e)
                else {
                    console.log(`Failed. Attempts left: ${retryTimes}`);
                    if (!retryTimes) reject(e)
                    else {
                        retryTimes--;
                        setTimeout(attempt, 2000)
                    }
                }
            })
    }

    attempt();
}))

userID = (handleURL.has('uid') && /[1-9][0-9]{0,10}$/.test(handleURL.get('uid'))) ? handleURL.get('uid') : "";

const init = (_userID, _retryTimes) => {
    if (_userID.length === 0) {
        console.log("EMPTY UID")
        return overlayInitDialogCB.checked = false;
    } else if (isNaN(_userID)) return console.error("UID NOT LEGIT")

    getInfoWithRetry(_userID, _retryTimes)
        .then(res => {
            odometer.classList.remove("loading");
            avatar.src = res.avatarURL;
            nickname.innerText = res.nickname;
            odometer.innerText = res.follower;
            document.title = `${res.nickname} - Bilibili 实时粉丝计数器`
        })
        .then(() => setTimeout(updatePeriodically, updateInterval))
        .catch(e => {
            console.log(e);
        })
}

const updatePeriodically = () => {
    if (flag.keepUpdating() && !flag.isPaused()) {
        getInfoWithRetry(userID, retryTimes)
            .then(res => odometer.innerText = res.follower)
            .catch(e => {
                console.log(e);
                updateToggle.checked = false;
            })
            .finally(() => setTimeout(updatePeriodically, updateInterval))
    } else setTimeout(updatePeriodically, 1200)

}

reduceMotionTg.addEventListener("change", e => {
    if (e.target.checked) document.body.classList.add("no-motion");
    else document.body.classList.remove("no-motion");
})

titleBar.addEventListener("click", () => overlaySettingsCB.checked = false)

document.addEventListener("visibilitychange", () => flag.isVisible = document.visibilityState !== 'hidden')

goBtn.addEventListener("click", () => {
    userID = document.getElementById("UIDInputBox").value;
    overlayInitDialogCB.checked = true;
    init(userID, retryTimes)
})

init(userID, retryTimes);
