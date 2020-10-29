var $$ = mdui.$
$$(function () {
    let $form = $$('form')
     
    $$('#submit').on('click', function () {
        if ($form[0].checkValidity()) {
            $form[0].submit()
        }
    })

    const appendScript = function (father) {
        let url = "https://jsonp.afeld.me/?callback=showFansCount&url=https%3A%2F%2Fapi.bilibili.com%2Fx%2Fweb-interface%2Fcard%3Fmid%3D" + userID + '&spam=' + Number(new Date)
        let elScriptChild = document.createElement('script')
        elScriptChild.setAttribute('src', url)
        elScriptChild.setAttribute('type', "text/javascript")
        elScriptChild.setAttribute('referrerpolicy', "no-referrer")
        father.appendChild(elScriptChild)
    }
})
