$(function () {
    const layer = layui.layer
    const form = layui.form
    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCateList()

    //为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log('ok')
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章类别失败')
                }
                initArtCateList()
                layer.msg('新增文章类别成功')
                //根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    //通过代理的形式为btn-edit绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        console.log(id)
        //发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式为修改分类的表单绑定Submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('修改分类失败')
                }
                layer.msg('更新成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //通过代理的形式为删除按钮绑定点击事件
    $('body').on('click', '.btn-del', function () {
        console.log('ok')
        var id = $(this).attr('data-Id')
        //提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                mehtod: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    initArtCateList()
                }
            })

        })
    })
})