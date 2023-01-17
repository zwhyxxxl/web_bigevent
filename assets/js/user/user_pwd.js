$(function () {
    const form = layui.form
    const layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        repwd: function (value) {
            //通过形参拿到的是确认密码框中的内容
            //还需要拿到密码框中的内容
            //然后进行一次等于的判断
            //如果判断失败 return一个错误的提示消息
            var pwd = $('[name=newPwd]').val()
            if (value !== pwd) {
                return '两次密码需要一致'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg('更新密码失败!' + res.message)
                }
                layer.msg('更新密码成功')
                //重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})
