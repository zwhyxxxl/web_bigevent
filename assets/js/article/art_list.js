$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义查询参数对象
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值，默认请求第一页的数据
        pagesize: 2.,//每页显示几条数据
        cate_id: '',//文章分类的Id
        state: ''//文章的发布状态
    }

    initTable()
    initCate()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            mehtod: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                //使用末班引擎渲染页面的数据
                // console.log(res)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                //调用模板引擎调用分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通知layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    //为筛选表单绑定submit时间
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件 重新渲染表格的数据
        initTable()
    })


    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        //调用laypage.render（）方法渲染分页
        laypage.render({
            elem: 'pageBox', //分页容器的ID
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候出发jump回调
            //出发junmp回调的方法有两种
            //1.点击页码的时候会出发jump回调
            //2.只要调用laypage.render()就会触发junmp回调
            jump: function (obj, first) {
                //可以通过first的值来判断是通过哪种方式处罚的jump回调
                //如果first的值为true，证明是方式2触发的
                //否则就是方式1触发的
                console.log(obj.curr)
                console.log(first)
                q.pagenum = obj.curr//把最新页码值赋值到q这个查询参数中
                //把最新的条目数赋值到q对象的pagesize中
                q.pagesize = obj.limit
                //根据最新的q获取对应的数据列表并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }


    //通过代理的方式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        //获取到文章的id
        var id = $(this).attr('data-id')
        //询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                mehtod: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //当数据删除完成后 需要判断当前这一页中是否还有剩余的数据，如果没有剩余的数据，则让页码值减1之后
                    //再重新调用initTable（）方法
                    if (len === 1) {
                        //如果len的值为1 证明删除完毕之后页面上就没有任何数据了
                        //页码值最小必须是1
                        q.pagenum = q.pagenum = 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }

            })
            layer.close(index)
        })
    })
})