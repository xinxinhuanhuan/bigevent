$(function() {
    getUserMassage()
        // 给退出按钮绑定点击事件
    $('#btnLogout').on('click', function() {
        var layer = layui.layer
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 点击确认之后的操作
            // 删除token属性
            localStorage.removeItem('token')
                // 跳转到登录页面
            location.href = '/login.html'

            layer.close(index);
        });
    })
})

// 获取用户信息的函数
function getUserMassage() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers获取用户信息
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 渲染头像的函数
            renderAvatar(res.data)
        },
        // 无论成功或者失败都会调用complate函数
        // complete: function(res) {
        //     console.log(res);
        //     // 可以使用res.responseJSON 获取数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }

        // }
    })
}
// 渲染头像
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎 &nbsp &nbsp' + name)
        // 按需渲染头像
    if (user.user_pic) {
        // 显示图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text_avatar').hide()
    } else {
        // 显示文本头像
        $('.text_avatar').html(name[0].toUpperCase()).show()
        $('.layui-nav-img').hide()
    }
}