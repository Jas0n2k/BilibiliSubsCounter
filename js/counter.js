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

const getInfo = (UID) => new Promise((resolve, reject) => {
    fetchWithTimeout(JSONP_API[1] + bilibiliAPI(UID), {
        method: "GET",
        referrerPolicy: "no-referrer"
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else throw new Error("Not OK!")
        })
        .then(json => {
            if (Number(json.code) !== 0) {
                let customErr = new Error(json.message);
                customErr.code = json.code;
                throw customErr;
            } else {
                resolve({
                    avatarURL: json.data.card.face,
                    nickname: json.data.card.name,
                    follower: json.data.follower
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
                console.log(`Failed. Attempts left: ${retryTimes}`);
                if (!retryTimes) {
                    reject(e)
                } else {
                    retryTimes--;
                    setTimeout(attempt, 2000)
                }
            })
    }

    attempt();
}))

window.onload = () => {
    const avatar = document.getElementById("c-avatar");
    const nickname = document.getElementById("c-nickname");
    const odometer = document.getElementById("odometer");
    const titleBar = document.getElementById("titleBar");
    const overlayCB = document.getElementById("overlayCB")
    const updateToggle = document.getElementById("updateToggle");
    const reduceMotionTg = document.getElementById("reduceMotion");
    let updateInterval = 3000;
    let retryTimes = 2;
    let userID = 258150656;

    const flag = {
        keepUpdating: () => updateToggle.checked,
        isPaused: () => !(overlayCB.checked),
        isVisible: true
    }

    reduceMotionTg.addEventListener("change", e => {
        if (e.target.checked) document.body.classList.add("no-motion");
        else document.body.classList.remove("no-motion");
    })

    titleBar.addEventListener("click", () => overlayCB.checked = false)

    document.addEventListener("visibilitychange", () => {
        flag.isVisible = document.visibilityState !== 'hidden';
    })


    const init = (_userID, _retryTimes) => new Promise((resolve, reject) => {
        getInfoWithRetry(_userID, _retryTimes)
            .then(res => {
                odometer.classList.remove("loading");
                avatar.src = res.avatarURL;
                nickname.innerText = res.nickname;
                odometer.innerText = res.follower;
                document.title = `${res.nickname} - Bilibili 实时粉丝计数器`
                resolve()
            })
            .catch(e => {
                console.log(e)
                reject(e)
            })
    })

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

    init(userID, retryTimes)
        .then(() => setTimeout(updatePeriodically, updateInterval))
        .catch(e => {
            console.log(e);
        })
}