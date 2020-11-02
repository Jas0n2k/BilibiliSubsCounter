var $$ = mdui.$
$$(function () {
    let $form = $$('form');
    let $IDField = $$('#IDfield')
    let $uid = $$('#uid');
    let $submit = $$('#submit');
    let $errorInfo = $$('#errorInfo');
    var re = /^[0-9]{1,11}$/;
    var re2 = /.*space.bilibili.com\/[0-9]{1,11}\/?$/;
    var re3 = /[0-9]{1,11}$/

    $uid.on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $submit.trigger('click')
        }
    }).on('input', function () {
        $IDField.removeClass('mdui-textfield-invalid');
    })

    $submit.on('click', function () {
        let pass = false
        let input = $uid.val()
        if (input) {
            if (re.test(input) || re2.test(input)) {
                $uid.val(input.match(re3)[0]);
                pass = true;
            }
            else {
                $errorInfo.text('输入不合法');
                $IDField.addClass('mdui-textfield-invalid');
            }
        }
        else {
            $errorInfo.text('输入值不能为空');
            $IDField.addClass('mdui-textfield-invalid');
        }
        if (pass) {
            $form[0].submit();
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
