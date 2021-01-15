$(function() {
    var layer = layui.layer
    var form = layui.form
        // 初始化富文本编辑器
    initEditor()
    initCate()
        // 定义获取文章类别的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败')
                }
                var htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }




    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择文件
    $('#btn_choose').on('click', function() {
            $('#coverFile').click()
        })
        // 选择封面
    $('#coverFile').on('change', function(e) {
            var files = e.target.files
            if (files.length === 0) {
                return
            }
            // 根据选择的文件，创建一个对应的 URL 地址：


            var newImgURL = URL.createObjectURL(files[0])
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 定义文章发布状态
    var art_state = '已发布'
        // 为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
        })
        // 为表单绑定submit事件
    $('#form_art').on('submit', function(e) {
            e.preventDefault()
                // 基于form表单创建formDate
            var fd = new FormData($(this)[0])
            fd.append('state', art_state)
                // ## 4. 将裁剪后的图片，输出为文件

            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 将文件对象存储到fd中
                    fd.append('cover_img', blob)
                        // 发起请求保存数据
                    publisherArticle(fd)
                })




        })
        // 定义发布文章的方法

    function publisherArticle(fd) {

        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败')
                }
                layer.msg('发表文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }
})