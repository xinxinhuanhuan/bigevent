// $(function() {
//     var layer = layui.layer
//     // var form = layui.form
//         // 初始化富文本编辑器
//     initEditor()
//         // initCate()
//         // editArt()
//         // 定义获取文章类别的方法
//         // function initCate() {
//         //     $.ajax({
//         //         method: 'GET',
//         //         url: '/my/article/cates',
//         //         success: function(res) {
//         //             if (res.status !== 0) {
//         //                 return layer.msg('获取列表失败')
//         //             }
//         //             var htmlStr = template('tpl_cate', res)
//         //             $('[name=cate_id]').html(htmlStr)
//         //             form.render()
//         //         }
//         //     })
//         // }

//     // // 1. 初始化图片裁剪器
//     // var $image = $('#image')

//     // // 2. 裁剪选项
//     // var options = {
//     //     aspectRatio: 400 / 280,
//     //     preview: '.img-preview'
//     // }




//     // // 3. 初始化裁剪区域
//     // $image.cropper(options)

//     // // 选择文件
//     // $('#btn_choose').on('click', function() {
//     //         $('#coverFile').click()
//     //     })
//     //     // 选择封面
//     // $('#coverFile').on('change', function(e) {
//     //         var files = e.target.files
//     //         if (files.length === 0) {
//     //             return
//     //         }
//     //         // 根据选择的文件，创建一个对应的 URL 地址：


//     //         var newImgURL = URL.createObjectURL(files[0])
//     //         $image
//     //             .cropper('destroy') // 销毁旧的裁剪区域
//     //             .attr('src', newImgURL) // 重新设置图片路径
//     //             .cropper(options) // 重新初始化裁剪区域
//     //     })
//     // 定义文章发布状态
//     // var art_state = '已发布'
//     //     // 为草稿按钮绑定点击事件
//     // $('#btnSave2').on('click', function() {
//     //         art_state = '草稿'
//     //     })
//     //     // 为表单绑定submit事件
//     // $('#form_art').on('submit', function(e) {
//     //         e.preventDefault()
//     //             // 基于form表单创建formDate
//     //         var fd = new FormData($(this)[0])
//     //         fd.append('state', art_state)
//     //             // ## 4. 将裁剪后的图片，输出为文件

//     //         $image
//     //             .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
//     //                 width: 400,
//     //                 height: 280
//     //             })
//     //             .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
//     //                 // 得到文件对象后，进行后续的操作
//     //                 // 将文件对象存储到fd中
//     //                 fd.append('cover_img', blob)
//     //                     // 发起请求保存数据
//     //                 publisherArticle(fd)
//     //             })




//     //     })
//     // 定义发布文章的方法

//     //     function publisherArticle(fd) {

//     //         $.ajax({
//     //             method: 'POST',
//     //             url: '/my/article/add',
//     //             data: fd,
//     //             contentType: false,
//     //             processData: false,
//     //             success: function(res) {
//     //                 if (res.status !== 0) {
//     //                     return layer.msg('发表文章失败')
//     //                 }
//     //                 layer.msg('发表文章成功')
//     //                 location.href = '/article/art_list.html'
//     //             }
//     //         })
//     //     }
// })

// // 编辑
// function editArt() {
//     var id = $('option').attr('id')
//     $.ajax({
//         method: 'GET',
//         url: '/my/article/' + id,
//         success: function(res) {
//             // console.log(res)
//             if (res.status !== 0) {
//                 return layer.msg('编辑失败')
//             }
//             form.val('form_art', res.data)

//         }
//     })
// }

// // 监听表单提交行为
// $('.layui-form').on('submit', function(e) {
//     // 阻止默认提交
//     e.preventDefault()
//         // 提交数据
//     $.ajax({
//         method: 'POST',
//         url: '/my/article/edit',
//         data: $(this).serialize(),
//         success: function(res) {
//             if (res.status !== 0) {
//                 return layer.msg('更新用户信息失败')
//             }
//             layer.msg('更新用户信息成功')
//                 // 调用父页面的方法,重新渲染用户头像和昵称
//             window.parent.getUserMassage()
//         }
//     })
// })
$(function() {
    // 通过 URLSearchParams 对象，获取 URL 传递过来的参数
    var params = new URLSearchParams(location.search)
    var artId = params.get('id')
        // 文章的发布状态
    var pubState = ''

    // 获取需要的 layui 对象
    var form = layui.form
    var layer = layui.layer
        // 1. 渲染文章分类列表
    renderArticleCates()

    function renderArticleCates() {
        $.get('/my/article/cates', function(res) {
            if (res.status !== 0) {
                return layer.msg('获取文章分类列表失败！')
            }
            var htmlStr = template('tpl_cate', res)
            $('#art_cate').html(htmlStr)
            form.render()
            getArticleById()
        })
    }

    // 2. 根据文章的 Id，获取文章的详情，并初始化表单的数据内容
    function getArticleById() {
        // 发起请求，获取文章详情
        $.get('/my/article/' + artId, function(res) {
            // 获取数据失败
            if (res.status !== 0) {
                return layer.msg('获取文章失败！')
            }
            // 获取数据成功
            var art = res.data
                // 为 form 表单赋初始值
            form.val('form_art', {
                Id: art.Id,
                title: art.title,
                cate_id: art.cate_id,
                content: art.content
            })

            // 手动初始化富文本编辑器
            initEditor()

            // 初始化图片裁剪器
            var $image = $('#image')

            $image.attr('src', 'http://api-breakingnews-web.itheima.net' + art.cover_img)
                // $image.attr('src', 'http://www.liulongbin.top:3007' + art.cover_img)

            // 裁剪选项
            var cropperOption = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview',
                    // 初始化图片裁剪框的大小
                    autoCropArea: 1
                }
                // 初始化裁剪区域
            $image.cropper(cropperOption)
        })
    }

    // 3. 选择封面
    $('#btn_choose').on('click', function() {

        $('#coverFile').click()
    })

    // 4. 监听文件选择框的 change 事件
    $('#coverFile').on('change', function(e) {
        var files = e.target.files
            // 没有选择文件
        if (files.length === 0) {
            return
        }
        // 重新为裁剪区域设置图片
        $('#image')
            .cropper('destroy')
            .attr('src', URL.createObjectURL(files[0]))
            .cropper({
                aspectRatio: 400 / 280,
                preview: '.img-preview'
            })
    })

    // 设置文章的发布状态

    var pubState = '已发布'

    $('#btnSave').on('click', function() {
        pubState = '草稿'
    })

    // 5. 发布文章
    $('#form_art').on('submit', function(e) {
        e.preventDefault()

        $('#image')
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 5.1 组织参数对象
                var fd = new FormData($('#form_art')[0])
                    // 5.2 添加封面
                fd.append('cover_img', blob)
                    // 5.3 添加文章的发表状态
                fd.append('state', pubState)
                    // 5.4 发起请求
                $.ajax({
                    method: 'POST',
                    url: '/my/article/edit',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        // console.log(res);

                        if (res.status !== 0) {
                            return layer.msg('编辑文章失败!')
                        }
                        layer.msg('编辑文章成功!')
                        location.href = '/article/art_list.html'
                    }
                })
            })
    })
})