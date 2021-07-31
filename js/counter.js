let JSONP_API = [
    "https://jsonp.afeld.me/?callback=none&url=",
    "https://api.codetabs.com/v1/proxy/?quest="
]

const bilibiliAPI = (uid) => "https://api.bilibili.com/x/web-interface/card?mid=" + uid + '&spam=' + Number(new Date);

window.onload = () => {

    fetch(JSONP_API[0] + encodeURIComponent(bilibiliAPI(262453663)), {
        method: "GET",
    })
        .then(res => {
            console.log(res)
            if(res.ok){
                return res.json();
            }
            else throw new Error("Not OK!")
        })
        .then(json => {
            console.log(json)
        })
        .catch(e => {
            console.log(e);
        })
}