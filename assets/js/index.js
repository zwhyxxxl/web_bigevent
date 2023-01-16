$(function () {
    // var layer = layui.layer
    //调用getUserinfo()获取用户基本信息
    getUserinfo()

    $('#btnLogout').on('click', function () {

        //eg1
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //清空本地存储中的token
            //跳转到登录页
            localStorage.removeItem('token')
            location.href = './login.html'
            //关闭弹出询问框
            layer.close(index)
        });

    })
})

//获取用户的基本信息
function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('获取用户失败')
            }
            //调用renderAvater（）渲染用户的头像
            renderAvatar(res.data)
        },

    })
}

//渲染用户的头像
function renderAvatar(user) {
    let name = user.nicknamen || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    //按需渲染用户的头像
    //渲染文字头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }
    //渲染文本头像
    else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}