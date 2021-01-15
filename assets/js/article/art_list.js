$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义一个查询参数
    var q = {
            pagenum: 1, //页码值
            pagesize: 2, //每页显示多少条数据
            cate_id: '', //文章分类的 Id
            state: '', //文章的状态
        }
        // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = dt.getFullYear()
            var m = padeZero(dt.getMonth() + 1)
            var d = padeZero(dt.getDate())

            var hh = padeZero(dt.getHours())
            var mm = padeZero(dt.getMinutes())
            var ss = padeZero(dt.getSeconds())
            return y + '-' + m + '-' + d + '  ' + ' ' + hh + ':' + mm + ':' + ss

        }
        // 补零
    function padeZero(n) {
        return n > 9 ? n : '0' + n

    }
    // 获取数据列表
    initArtList()

    function initArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                layer.msg('获取数据成功')
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
                    // 得到分类列表的总数
                renderPage(res.total)
            }
        })
    }
    // 获取分类列表
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败')
                }
                // 调用模板引擎
                var htmlStr = template('select', res)
                $('#cate_id').html(htmlStr)
                    // console.log(res);
                form.render()

            }
        })
    }

    // 为筛选框绑定提交事件
    $('#form_select').on('submit', function(e) {
        e.preventDefault()
            // 获取选中选项的值
        var cate_id = $('[name = cate_id]').val()
        var state = $('[name = state]').val()
        q.cate_id = cate_id
        q.state = state
        initArtList()

    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'page',
            count: total,
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认显示哪一页
            limits: [2, 3, 5, 8],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 触发页码值时,会调用jump回调

            // 触发jump回调的方式有两种
            // 1,点击页码的时候触发jump回调
            // 2,调用laypage.render()时触发jump回调
            jump: function(obj, first) {
                // 可以通过first值来判断那种方式触发了jump回调
                // 如果first值为true 证明是方式2触发
                // console.log(obj.curr);
                // 将最新的页码值赋值到q上
                // console.log(first);
                //console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit
                q.pagenum = obj.curr
                if (!first) {
                    initArtList()

                }
            }


        })

    }

    // 通过代理为删除按钮绑定点击事件
    $('tbody').on('click', '#btnD', function() {
        var id = $(this).attr('data-id')
        var len = $('#btnD').length
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    // 判断数据是否为一条
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // layer.msg('删除文章成功')
                    initArtList()
                }
            })
            layer.close(index)

        })
    })


    // 6. 监听编辑按钮的点击事件
    $('body').on('click', '#btnEdit', function() {
        location.href = '/article/art_edit.html?id=' + $(this).attr('data-edit')
    })
})