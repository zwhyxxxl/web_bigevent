
//每次调用$.get() $.post() $.ajax()的时候 会先调用这个函数
//在这个函数中会拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    console.log(options.url)
    //在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})