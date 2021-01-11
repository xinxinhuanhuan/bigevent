$(function() {
    // 获取layUI里的form
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 设置密码校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        rnpwd: function(value) {
            // 获取第一次输入的密码
            var rpwd = $('#chpwd [name=newPwd]').val()
                // 判断两次输入密码是否一致
            if (rpwd !== value) {
                return '两次密码不一致'
            }
        },
        samepwd: function(value) {
            var oldpwd = $('#chpwd [name=oldPwd]').val()
            if (value === oldpwd) {
                return '新旧密码不能相同'
            }
        }

    })


    $('#resetPwd').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改密码失败')
                        // console.log(res);

                }
                layer.msg('修改密码成功')
                    // 重置表单
                $('#resetPwd')[0].reset()
            }
        })
    })



})