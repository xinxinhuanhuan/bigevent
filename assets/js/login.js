$(function() {
    // 给去登录添加点击事件
    $("#link_reg").on("click", function() {

            $(".reg").show()
            $(".login").hide()
        })
        // 给去注册账号添加点击事件
    $("#link_login").on("click", function() {
            $(".reg").hide()
            $(".login").show()
        })
        // 获取layUI里的form
    var form = layui.form
    var layer = layui.layer
    form.verify({
            // 设置密码校验规则
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            rpwd: function(value) {
                // 获取第一次输入的密码
                var pwd = $('.reg [name=password]').val()
                    // 判断两次输入密码是否一致
                if (pwd !== value) {
                    return '两次密码不一致'
                }
            }

        })
        // 监听注册表单
    $("#form_reg").on('submit', function(e) {
            e.preventDefault()
                // 发起post请求
            var data = { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message);

                }
                layer.msg('注册成功,请登录');

                // console.log('注册成功');
                $('#link_login').click()

            })
        })
        // 监听登录表单提交行为
    $("#form_login").submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
            // 发起ajax请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单信息
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!')
                }
                // 将得到的token保存下来
                localStorage.setItem('token', res.token)
                layer.msg('登录成功!')
                    // 登录成功后跳转到主页
                location.href = '/index.html'
            }
        })
    })
})