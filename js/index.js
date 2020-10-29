var $$ = mdui.$
$$(function(){
    let $form = $$('form')
    $$('#submit').on('click', function(){
        if($form)
        $form[0].submit()
    })
})
