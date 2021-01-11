var $$ = mdui.$
$$(function () {
    let $form = $$('form');
    let $IDField = $$('#IDfield')
    let $uid = $$('#uid');
    let $submit = $$('#submit');
    let $errorInfo = $$('#errorInfo');
    var re = /^[0-9]{1,11}$/;
    var re2 = /^.*space.bilibili.com\/[0-9]{1,11}.*$/;
    var re3 = /^.*space.bilibili.com\/[0-9]{1,11}/;
    var re4 = /[0-9]{1,11}$/

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
                if (re.test(input)) $uid.val(input);
                else $uid.val(input.match(re3)[0].match(re4)[0]);
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
})
