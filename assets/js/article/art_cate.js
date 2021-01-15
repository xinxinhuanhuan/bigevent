$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {

                // return layer.msg('加载数据失败')
                // console.log(res);

                var htmlStr = template('tpl_table', res)

                $('.tbody').html(htmlStr)

            }
        })
    }
    // 为添加按钮绑定点击事件
    var indexAdd = null
    $('#addBtn').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                title: '添加文章分类',
                content: $('#addList').html(),
                area: ['400px', '250px']
            });
        })
        // 通过代理的方法为表单绑定提交事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('添加类别失败')
                    }
                    initArtCateList()
                    layer.msg('添加类别成功')
                    layer.close(indexAdd)

                }
            })

        })
        // 为编辑按钮绑定提交行为
    var indexEdit = null

    $('.tbody').on('click', '#btnEdit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#edit').html(),
            area: ['400px', '250px']
        })
        var id = $(this).attr('data-edit')
            // console.log(id);

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
                    // console.log(res);

            }
        })

    })

    // 监听修改文章类别的弹出层提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改类别失败')
                }
                layer.msg('修改类别成功')
                layer.close(indexEdit)
                initArtCateList()
            }

        })
    })

    // 监听删除按钮的点击行为
    $('.tbody').on('click', '#btnD', function() {
        var id = $(this).attr('data-edit')
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index)
                    initArtCateList()
                }

            })

        })

    })
})