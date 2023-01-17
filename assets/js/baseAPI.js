
//每次调用$.get() $.post() $.ajax()的时候 会先调用这个函数
//在这个函数中会拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    //在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    if (options.url.indexOf('/my/') != -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
        //不论成功还是失败都会调用complete函数
        options.complete = function (res) {
            // console.log(res)
            //在complete回调函数中可以使用responseJSON拿到服务器相应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //清空token
                localStorage.removeItem('token')
                //跳转到登录页
                location.href = './login.html'
            }
        }
    }
})